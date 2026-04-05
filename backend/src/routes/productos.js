import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where: { activo: true },
      include: { proveedor: { select: { nombre: true } } },
      orderBy: { nombre: 'asc' },
    })
    res.json(productos)
  } catch { res.status(500).json({ error: 'Error al obtener productos' }) }
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { nombre, precioCompra, precioVenta, stockActual, stockMinimo, proveedorId } = req.body
  try {
    const producto = await prisma.producto.create({
      data: { nombre, precioCompra, precioVenta, stockActual: stockActual ?? 0, stockMinimo: stockMinimo ?? 5, proveedorId },
    })
    res.status(201).json(producto)
  } catch { res.status(500).json({ error: 'Error al crear producto' }) }
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id)
  const { nombre, precioCompra, precioVenta, stockMinimo, proveedorId } = req.body
  try {
    const producto = await prisma.producto.update({ where: { id }, data: { nombre, precioCompra, precioVenta, stockMinimo, proveedorId } })
    res.json(producto)
  } catch { res.status(500).json({ error: 'Error al actualizar producto' }) }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.producto.update({ where: { id: parseInt(req.params.id) }, data: { activo: false } })
    res.json({ ok: true })
  } catch { res.status(500).json({ error: 'Error al desactivar producto' }) }
})

export default router
