import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { autenticar, requerirAdmin } from '../middleware/auth.js'
const router = Router()
const prisma = new PrismaClient()

router.get('/', autenticar, async (_, res) => {
  const data = await prisma.cliente.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } })
  res.json(data)
})
router.post('/', autenticar, async (req, res) => {
  const { nombre, identificacion, telefono, correo, direccion } = req.body
  try {
    const data = await prisma.cliente.create({ data: { nombre, identificacion: identificacion?.trim() || null, telefono, correo, direccion } })
    res.status(201).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
router.put('/:id', autenticar, async (req, res) => {
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
router.delete('/:id', autenticar, requerirAdmin, async (req, res) => {
  await prisma.cliente.update({ where: { id: parseInt(req.params.id) }, data: { activo: false } })
  res.json({ ok: true })
})
export default router
