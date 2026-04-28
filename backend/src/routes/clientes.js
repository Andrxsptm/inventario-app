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
  const { nombre, identificacion, telefono, correo, direccion } = req.body
  try {
    const data = await prisma.cliente.create({ data: { nombre, identificacion: identificacion?.trim() || null, telefono, correo, direccion } })
    res.status(201).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
router.put('/:id', authenticate, async (req, res) => {
  const { nombre, identificacion, telefono, correo, direccion } = req.body
  try {
    const data = await prisma.cliente.update({
      where: { id: parseInt(req.params.id) },
      data: { nombre, identificacion: identificacion?.trim() || null, telefono, correo, direccion }
    })
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  await prisma.cliente.update({ where: { id: parseInt(req.params.id) }, data: { activo: false } })
  res.json({ ok: true })
})
export default router
