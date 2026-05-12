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
  const data = await prisma.proveedor.create({ data: { nombre, telefono, nit, direccion, notas } })
  res.status(201).json(data)
})
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { nombre, telefono, nit, direccion, notas } = req.body
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
  await prisma.proveedor.update({ where: { id: parseInt(req.params.id) }, data: { activo: false } })
  res.json({ ok: true })
})
export default router
