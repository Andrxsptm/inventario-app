import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { autenticar } from '../middleware/auth.js'
const router = Router()
const prisma = new PrismaClient()

// GET /api/inventario  — stock actual con clasificación de alertas
router.get('/', autenticar, async (_, res) => {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    include: { proveedor: { select: { nombre: true } } },
    orderBy: { stockActual: 'asc' },
  })
  const result = productos.map(p => ({
    ...p,
    alerta:
      p.stockActual === 0       ? 'AGOTADO'  :
      p.stockActual <= p.stockMinimo * 0.5 ? 'CRÍTICO' :
      p.stockActual <= p.stockMinimo       ? 'BAJO'    : 'OK',
  }))
  res.json(result)
})
export default router
