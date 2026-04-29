import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth.js'
const router = Router()
const prisma = new PrismaClient()

// GET /api/reportes/dashboard
router.get('/dashboard', authenticate, async (_, res) => {
  const hoy = new Date(); hoy.setHours(0,0,0,0)
  const productosActivos = await prisma.producto.findMany({ where: { activo: true } })
  const productosStockCritico = productosActivos
    .filter(p => p.stockActual <= p.stockMinimo)
    .sort((a, b) => a.stockActual - b.stockActual)

  const [ventasHoy, ultimasVentas, ultimosClientes] = await Promise.all([
    prisma.venta.aggregate({ where: { fecha: { gte: hoy }, estado: 'COMPLETADA' }, _sum: { total: true } }),
    prisma.venta.findMany({ take: 5, orderBy: { fecha: 'desc' }, include: { items: { include: { producto: true } } } }),
    prisma.cliente.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ])
  res.json({ 
    ventasHoy: ventasHoy._sum.total ?? 0, 
    stockBajo: productosStockCritico.length, 
    ultimasVentas, 
    ultimosClientes, 
    productosAgotarse: productosStockCritico 
  })
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
