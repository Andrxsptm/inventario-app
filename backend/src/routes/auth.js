import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' })

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.activo)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return res.status(401).json({ error: 'Credenciales incorrectas' })

    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )
    res.json({ token, user: { id: user.id, nombre: user.nombre, rol: user.rol, email: user.email } })
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/auth/register  — Solo ADMINISTRADOR puede crear usuarios
router.post('/register', authenticate, requireAdmin, async (req, res) => {
  const { email, password, nombre, rol } = req.body
  if (!email || !password || !nombre)
    return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' })

  try {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists)
      return res.status(409).json({ error: 'Ya existe un usuario con ese email' })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        nombre,
        rol: rol || 'VENDEDOR',
      },
      select: { id: true, nombre: true, email: true, rol: true, createdAt: true }
    })
    res.status(201).json({ message: 'Usuario creado exitosamente', user })
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el usuario' })
  }
})

// PUT /api/auth/cambiar-password  — Usuario autenticado cambia su propia contraseña
router.put('/cambiar-password', authenticate, async (req, res) => {
  const { passwordActual, passwordNueva } = req.body
  if (!passwordActual || !passwordNueva)
    return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' })
  if (passwordNueva.length < 6)
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    // Verificar contraseña actual con bcrypt (lo estándar)
    const valid = await bcrypt.compare(passwordActual, user.password)
    // Fallback: comparación directa por si la contraseña fue guardada sin hashear
    const validDirect = (passwordActual === user.password)

    console.log(`[cambiar-password] user=${user.email} bcrypt=${valid} direct=${validDirect}`)

    if (!valid && !validDirect)
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' })

    const hash = await bcrypt.hash(passwordNueva, 10)
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } })

    console.log(`[cambiar-password] ✅ Contraseña actualizada para ${user.email}`)
    res.json({ message: 'Contraseña actualizada exitosamente' })
  } catch (err) {
    console.error('[cambiar-password] Error:', err.message)
    res.status(500).json({ error: 'Error al cambiar la contraseña' })
  }
})

// GET /api/auth/alertas  — Notificaciones basadas en stock bajo y órdenes pendientes
router.get('/alertas', authenticate, async (req, res) => {
  try {
    const [todosProductos, ordenesPendientes] = await Promise.all([
      prisma.producto.findMany({ where: { activo: true }, orderBy: { stockActual: 'asc' } }),
      prisma.ordenCompra.findMany({
        where: { estado: 'PENDIENTE' },
        include: { proveedor: { select: { nombre: true } } },
        orderBy: { fecha: 'desc' },
        take: 5,
      }),
    ])

    const stockBajo = todosProductos.filter(p => p.stockActual <= p.stockMinimo).slice(0, 10)

    const alertas = [
      ...stockBajo.map(p => ({
        id: `stock-${p.id}`,
        tipo: p.stockActual === 0 ? 'agotado' : 'stock_bajo',
        titulo: p.stockActual === 0 ? 'Producto Agotado' : 'Stock Bajo',
        mensaje: `${p.nombre} tiene ${p.stockActual} unidades (mín: ${p.stockMinimo})`,
        fecha: p.createdAt,
      })),
      ...ordenesPendientes.map(o => {
        const entrega = o.fechaEntrega ? new Date(o.fechaEntrega).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Sin fecha asignada';
        return {
          id: `orden-${o.id}`,
          tipo: 'orden_pendiente',
          titulo: 'Orden Pendiente',
          mensaje: `La orden #${o.id} de ${o.proveedor.nombre} está pendiente. Fecha de entrega: ${entrega}`,
          fecha: o.fecha,
        }
      }),
    ]

    res.json({ alertas, total: alertas.length })
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar alertas' })
  }
})

export default router
