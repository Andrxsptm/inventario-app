import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth.js'
const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (_, res) => {
  const data = await prisma.proveedor.findMany({ orderBy: { nombre: 'asc' } })
  res.json(data)
})
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { nombre, telefono, nit, direccion, notas } = req.body
  if (!nombre || !telefono) return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' })
  if (nit && nit.replace(/\D/g, '').length !== 10) return res.status(400).json({ error: 'El NIT debe tener exactamente 10 dígitos (9 + DV)' })
  const data = await prisma.proveedor.create({ data: { nombre, telefono, nit, direccion, notas } })
  res.status(201).json(data)
})
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { nombre, telefono, nit, direccion, notas } = req.body
  if (!nombre || !telefono) return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' })
  if (nit && nit.replace(/\D/g, '').length !== 10) return res.status(400).json({ error: 'El NIT debe tener exactamente 10 dígitos (9 + DV)' })
  const data = await prisma.proveedor.update({ where: { id: parseInt(req.params.id) }, data: { nombre, telefono, nit, direccion, notas } })
  res.json(data)
})
router.put('/:id/toggle-activo', authenticate, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id)
  const p = await prisma.proveedor.findUnique({ where: { id } })
  const data = await prisma.proveedor.update({ where: { id }, data: { activo: !p.activo } })
  res.json(data)
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const productosActivos = await prisma.producto.count({ where: { proveedorId: id, activo: true } })
    if (productosActivos > 0) {
      return res.status(409).json({ error: `No se puede eliminar: tiene ${productosActivos} producto(s) activo(s) asociado(s). Elimina o reasigna los productos primero.` })
    }
    await prisma.proveedor.delete({ where: { id } })
    res.json({ ok: true })
  } catch (e) {
    if (e.code === 'P2003') return res.status(409).json({ error: 'No se puede eliminar: tiene registros de compras asociados.' })
    res.status(500).json({ error: 'Error al eliminar proveedor' })
  }
})
export default router
