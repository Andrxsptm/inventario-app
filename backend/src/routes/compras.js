import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth.js'
const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (_, res) => {
  const data = await prisma.ordenCompra.findMany({
    include: { proveedor: true, items: { include: { producto: true } } },
    orderBy: { fecha: 'desc' },
  })
  res.json(data)
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { proveedorId, items, notas } = req.body
  let total = items.reduce((acc, i) => acc + i.cantidad * i.precioUnit, 0)
  const orden = await prisma.ordenCompra.create({
    data: { proveedorId, total, notas, items: { create: items.map(i => ({ ...i, subtotal: i.cantidad * i.precioUnit })) } },
    include: { items: true },
  })
  res.status(201).json(orden)
})

// Marcar como recibida → actualiza stock
router.put('/:id/recibir', authenticate, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    await prisma.$transaction(async (tx) => {
      const orden = await tx.ordenCompra.findUnique({ where: { id }, include: { items: true } })
      if (!orden || orden.estado !== 'PENDIENTE') throw new Error('Orden no válida')
      for (const item of orden.items)
        await tx.producto.update({ where: { id: item.productoId }, data: { stockActual: { increment: item.cantidad } } })
      await tx.ordenCompra.update({ where: { id }, data: { estado: 'RECIBIDA' } })
    })
    res.json({ ok: true })
  } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id/cancelar', authenticate, requireAdmin, async (req, res) => {
  await prisma.ordenCompra.update({ where: { id: parseInt(req.params.id) }, data: { estado: 'CANCELADA' } })
  res.json({ ok: true })
})
export default router
