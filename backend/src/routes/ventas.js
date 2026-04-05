import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth.js'
const router = Router()
const prisma = new PrismaClient()

// GET /api/ventas
router.get('/', authenticate, async (_, res) => {
  const data = await prisma.venta.findMany({
    include: { cliente: true, usuario: { select: { nombre: true } }, items: { include: { producto: true } } },
    orderBy: { fecha: 'desc' },
  })
  res.json(data)
})

// POST /api/ventas  — crea venta y descuenta stock
router.post('/', authenticate, async (req, res) => {
  const { clienteId, items, notas } = req.body
  // items: [{ productoId, cantidad, precioUnit }]
  try {
    const venta = await prisma.$transaction(async (tx) => {
      let total = 0
      const itemsData = []
      for (const item of items) {
        const producto = await tx.producto.findUnique({ where: { id: item.productoId } })
        if (!producto || producto.stockActual < item.cantidad)
          throw new Error(`Stock insuficiente para ${producto?.nombre ?? item.productoId}`)
        const subtotal = item.cantidad * item.precioUnit
        total += subtotal
        itemsData.push({ productoId: item.productoId, cantidad: item.cantidad, precioUnit: item.precioUnit, subtotal })
        await tx.producto.update({ where: { id: item.productoId }, data: { stockActual: { decrement: item.cantidad } } })
      }
      const venta = await tx.venta.create({
        data: { total, notas, usuarioId: req.user.id, clienteId: clienteId ?? null, items: { create: itemsData } },
        include: { items: true },
      })
      if (clienteId) await tx.cliente.update({ where: { id: clienteId }, data: { totalCompras: { increment: total } } })
      return venta
    })
    res.status(201).json(venta)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/ventas/:id/anular  — solo admin
router.put('/:id/anular', authenticate, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    await prisma.$transaction(async (tx) => {
      const venta = await tx.venta.findUnique({ where: { id }, include: { items: true } })
      if (!venta || venta.estado === 'ANULADA') throw new Error('Venta no válida')
      for (const item of venta.items)
        await tx.producto.update({ where: { id: item.productoId }, data: { stockActual: { increment: item.cantidad } } })
      await tx.venta.update({ where: { id }, data: { estado: 'ANULADA' } })
    })
    res.json({ ok: true })
  } catch (err) { res.status(400).json({ error: err.message }) }
})
export default router
