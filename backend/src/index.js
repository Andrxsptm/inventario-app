import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes       from './routes/auth.js'
import productosRoutes  from './routes/productos.js'
import proveedoresRoutes from './routes/proveedores.js'
import clientesRoutes   from './routes/clientes.js'
import ventasRoutes     from './routes/ventas.js'
import comprasRoutes    from './routes/compras.js'
import inventarioRoutes from './routes/inventario.js'
import reportesRoutes   from './routes/reportes.js'
import facturasRoutes   from './routes/facturas.js'
import configuracionRoutes from './routes/configuracion.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

// Routes
app.use('/api/auth',        authRoutes)
app.use('/api/productos',   productosRoutes)
app.use('/api/proveedores', proveedoresRoutes)
app.use('/api/clientes',    clientesRoutes)
app.use('/api/ventas',      ventasRoutes)
app.use('/api/compras',     comprasRoutes)
app.use('/api/inventario',     inventarioRoutes)
app.use('/api/reportes',       reportesRoutes)
app.use('/api/ventas',         facturasRoutes)
app.use('/api/configuracion',  configuracionRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})
