import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth.js'
const router = Router()
const prisma = new PrismaClient()

router.get('/', authenticate, async (_, res) => {
  const data = await prisma.cliente.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } })
  res.json(data)
})
router.post('/', authenticate, async (req, res) => {
  const { nombre, telefono, correo, direccion } = req.body
  const data = await prisma.cliente.create({ data: { nombre, telefono, correo, direccion } })
  res.status(201).json(data)
})
router.put('/:id', authenticate, async (req, res) => {
  const { nombre, telefono, correo, direccion } = req.body
  const data = await prisma.cliente.update({ where: { id: parseInt(req.params.id) }, data: { nombre, telefono, correo, direccion } })
  res.json(data)
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await prisma.cliente.update({ where: { id: parseInt(req.params.id) }, data: { activo: false } })
  res.json({ ok: true })
})
export default router
