import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { autenticar, requerirAdmin } from '../middleware/auth.js'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const router = Router()
const prisma = new PrismaClient()

// GET /api/configuracion/empresa
router.get('/empresa', autenticar, async (_, res) => {
  try {
    let config = await prisma.configuracionEmpresa.findUnique({ where: { id: 1 } })
    if (!config) {
      config = await prisma.configuracionEmpresa.create({ data: { id: 1 } })
    }
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/configuracion/empresa
router.put('/empresa', autenticar, async (req, res) => {
  try {
    const { nombre, nit, direccion, telefono, correo, web, colorPrimario, piePagina, mostrarLogo } = req.body
    const config = await prisma.configuracionEmpresa.upsert({
      where: { id: 1 },
      update: { nombre, nit, direccion, telefono, correo, web, colorPrimario, piePagina, mostrarLogo },
      create: { id: 1, nombre, nit, direccion, telefono, correo, web, colorPrimario, piePagina, mostrarLogo },
    })
    res.json(config)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// POST /api/configuracion/backup-sql — Solo ADMINISTRADOR
// Usa pg_dump con la URL directa de la BD para generar un respaldo SQL real.
// Si pg_dump no está disponible, exporta los datos en formato JSON estructurado.
router.post('/backup-sql', autenticar, requerirAdmin, async (req, res) => {
  const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
  if (!directUrl) return res.status(500).json({ error: 'No se encontró la URL de conexión a la base de datos' })

  const fecha = new Date().toISOString().slice(0, 10)
  const filename = `stocker_backup_${fecha}.sql`

  try {
    // Intentar pg_dump con la cadena de conexión directa de Supabase
    const { stdout } = await execAsync(`pg_dump "${directUrl}" --no-password --schema=public`, {
      maxBuffer: 50 * 1024 * 1024, // 50 MB
      timeout: 60000,              // 60 segundos
    })
    res.setHeader('Content-Type', 'application/sql')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(stdout)

  } catch (pgErr) {
    // pg_dump no disponible — exportar datos de todas las tablas en formato SQL-like JSON
    console.warn('[backup-sql] pg_dump no disponible, exportando JSON estructurado:', pgErr.message)

    try {
      const [users, productos, clientes, ventas, items, proveedores, compras, itemsCompra, config] = await Promise.all([
        prisma.user.findMany(),
        prisma.producto.findMany(),
        prisma.cliente.findMany(),
        prisma.venta.findMany({ include: { items: true } }),
        prisma.itemVenta.findMany(),
        prisma.proveedor.findMany(),
        prisma.ordenCompra.findMany(),
        prisma.itemOrdenCompra.findMany(),
        prisma.configuracionEmpresa.findMany(),
      ])

      const backup = {
        version: '1.0',
        fechaBackup: new Date().toISOString(),
        sistema: 'Stocker',
        nota: 'pg_dump no disponible en este servidor. Instala PostgreSQL CLI para obtener backup SQL completo.',
        tablas: { users, productos, clientes, ventas, itemsVenta: items, proveedores, ordenesCompra: compras, itemsOrdenCompra: itemsCompra, configuracionEmpresa: config }
      }

      const jsonStr = JSON.stringify(backup, null, 2)
      const jsonFilename = `stocker_backup_${fecha}.json`
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename="${jsonFilename}"`)
      res.send(jsonStr)

    } catch (dbErr) {
      res.status(500).json({ error: 'Error al generar el respaldo: ' + dbErr.message })
    }
  }
})

export default router
