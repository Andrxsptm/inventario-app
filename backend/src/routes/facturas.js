import { Router } from 'express'
import { autenticar } from '../middleware/auth.js'
import { obtenerPdf, obtenerXml } from '../services/facturaService.js'

const router = Router()

// GET /api/ventas/:id/factura/pdf
router.get('/:id/factura/pdf', autenticar, async (req, res) => {
  try {
    const ventaId = parseInt(req.params.id)
    const { pdfBuffer, venta } = await obtenerPdf(ventaId)
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${venta.numeroFactura}.pdf"`)
    res.setHeader('Content-Length', pdfBuffer.length)
    res.send(pdfBuffer)
  } catch (err) {
    console.error('Error generando PDF:', err)
    res.status(400).json({ error: err.message })
  }
})

// GET /api/ventas/:id/factura/xml
router.get('/:id/factura/xml', autenticar, async (req, res) => {
  try {
    const ventaId = parseInt(req.params.id)
    const xml = await obtenerXml(ventaId)
    
    res.setHeader('Content-Type', 'application/xml')
    res.send(xml)
  } catch (err) {
    console.error('Error obteniendo XML:', err)
    res.status(400).json({ error: err.message })
  }
})

export default router
