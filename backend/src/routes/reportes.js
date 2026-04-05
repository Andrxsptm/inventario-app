import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
const router = Router()
const prisma = new PrismaClient()

// GET /api/reportes/dashboard
router.get('/dashboard', authenticate, async (_, res) => {
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  const [ventasHoy, stockBajo, ultimasVentas, ultimosClientes, productosAgotarse] = await Promise.all([
    prisma.venta.aggregate({ where: { fecha: { gte: hoy }, estado: 'COMPLETADA' }, _sum: { total: true } }),
    prisma.producto.count({ where: { activo: true, stockActual: { lte: prisma.producto.fields.stockMinimo } } }),
    prisma.venta.findMany({ take: 5, orderBy: { fecha: 'desc' }, include: { items: { include: { producto: true } } } }),
    prisma.cliente.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.producto.findMany({ where: { activo: true, stockActual: { lte: 10 } }, orderBy: { stockActual: 'asc' }, take: 10 }),
  ])
  res.json({ ventasHoy: ventasHoy._sum.total ?? 0, stockBajo, ultimasVentas, ultimosClientes, productosAgotarse })
})

// GET /api/reportes/ventas?desde=&hasta=
router.get('/ventas', authenticate, async (req, res) => {
  const { desde, hasta } = req.query
  const data = await prisma.venta.findMany({
    where: { fecha: { gte: desde ? new Date(desde) : undefined, lte: hasta ? new Date(hasta) : undefined }, estado: 'COMPLETADA' },
    include: { items: { include: { producto: true } }, cliente: true },
    orderBy: { fecha: 'desc' },
  })
  res.json(data)
})
export default router
