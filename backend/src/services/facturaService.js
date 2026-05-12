import PDFDocument from 'pdfkit'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ──────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────

function pad(n, len = 4) {
  return String(n).padStart(len, '0')
}

function fmtMoney(n) {
  return n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

// ──────────────────────────────────────────────
//  Obtener configuración de empresa (singleton)
// ──────────────────────────────────────────────
async function getConfig() {
  let config = await prisma.configuracionEmpresa.findUnique({ where: { id: 1 } })
  if (!config) {
    config = await prisma.configuracionEmpresa.create({ data: { id: 1 } })
  }
  return config
}

// ──────────────────────────────────────────────
//  Generar número de factura correlativo
// ──────────────────────────────────────────────
export async function generarNumeroFactura(tx) {
  const ultima = await (tx || prisma).venta.findFirst({
    where: { numeroFactura: { not: null } },
    orderBy: { id: 'desc' },
    select: { numeroFactura: true }
  })
  const siguiente = ultima
    ? parseInt(ultima.numeroFactura.replace('FAC-', ''), 10) + 1
    : 1
  return `FAC-${pad(siguiente)}`
}

// ──────────────────────────────────────────────
//  Generar XML UBL 2.1 (facturación electrónica)
// ──────────────────────────────────────────────
export function generarXml(venta, config) {
  const fecha = new Date(venta.fecha).toISOString().split('T')[0]
  const hora = new Date(venta.fecha).toISOString().split('T')[1].slice(0, 8)

  // Cálculos IVA informativo (del costo de compra)
  let totalIvaCosto = 0
  const lineas = venta.items.map((item, idx) => {
    const ivaCosto = item.cantidad * (item.producto?.precioCompra || 0) * 19 / 119
    totalIvaCosto += ivaCosto
    return `
    <cac:InvoiceLine>
      <cbc:ID>${idx + 1}</cbc:ID>
      <cbc:InvoicedQuantity unitCode="EA">${item.cantidad}</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="COP">${(item.cantidad * item.precioUnit).toFixed(2)}</cbc:LineExtensionAmount>
      <cac:Item>
        <cbc:Description>${item.producto?.nombre || 'Producto'}</cbc:Description>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="COP">${item.precioUnit.toFixed(2)}</cbc:PriceAmount>
      </cac:Price>
    </cac:InvoiceLine>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>DIAN 2.1</cbc:CustomizationID>
  <cbc:ID>${venta.numeroFactura}</cbc:ID>
  <cbc:IssueDate>${fecha}</cbc:IssueDate>
  <cbc:IssueTime>${hora}</cbc:IssueTime>
  <cbc:InvoiceTypeCode>01</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>

  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${config.nombre}</cbc:Name>
      </cac:PartyName>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${config.nit}</cbc:CompanyID>
        <cbc:TaxLevelCode>NO_RESPONSABLE_IVA</cbc:TaxLevelCode>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${config.nombre}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
      <cac:Contact>
        <cbc:Telephone>${config.telefono}</cbc:Telephone>
        <cbc:ElectronicMail>${config.correo}</cbc:ElectronicMail>
      </cac:Contact>
      <cac:PhysicalLocation>
        <cac:Address>
          <cbc:Line>${config.direccion}</cbc:Line>
        </cac:Address>
      </cac:PhysicalLocation>
    </cac:Party>
  </cac:AccountingSupplierParty>

  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${venta.cliente?.nombre || 'Consumidor Final'}</cbc:Name>
      </cac:PartyName>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${venta.cliente?.identificacion || '000000000'}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingCustomerParty>

  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="COP">${totalIvaCosto.toFixed(2)}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="COP">${venta.total.toFixed(2)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="COP">${totalIvaCosto.toFixed(2)}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:Percent>0.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>

  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="COP">${venta.total.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="COP">${venta.total.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="COP">${venta.total.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="COP">${venta.total.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
${lineas.join('')}
</Invoice>`
}

// ──────────────────────────────────────────────
//  Generar PDF con pdfkit
// ──────────────────────────────────────────────
export function generarPdf(venta, config) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 50 })
    const buffers = []

    doc.on('data', (chunk) => buffers.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    const accentColor = hexToRgb(config.colorPrimario || '#f97316')
    const pageW = doc.page.width - 100 // margins

    // ── HEADER ──────────────────────────────
    doc.fontSize(18).font('Helvetica-Bold')
       .fillColor(accentColor)
       .text(config.nombre, 50, 50)
    
    doc.fontSize(8).font('Helvetica')
       .fillColor('#666666')
       .text(`NIT: ${config.nit}`, 50, 75)
       .text(config.direccion, 50, 87)
    
    doc.text(config.correo, 50, 102)
       .text(config.telefono, 220, 102)
       .text(config.web, 380, 102)

    // ── Línea separadora ──────────────────
    doc.moveTo(50, 122).lineTo(50 + pageW, 122)
       .strokeColor(accentColor).lineWidth(2).stroke()

    // ── TÍTULO FACTURA ──────────────────────
    doc.fontSize(26).font('Helvetica-Bold')
       .fillColor('#1a1a1a')
    const titulo = 'F   A   C   T   U   R   A'
    const tituloW = doc.widthOfString(titulo)
    doc.text(titulo, (doc.page.width - tituloW) / 2, 138)

    // ── INFO DE LA FACTURA ──────────────────
    const infoY = 180
    const col1 = 50, col2 = 200, col3 = 320, col4 = 440

    // Fila de encabezados gris
    doc.rect(50, infoY, pageW, 20).fill('#f0f0f0')
    doc.fontSize(7).font('Helvetica-Bold').fillColor('#444444')
    doc.text('Fecha de la factura', col1 + 5, infoY + 6)
    doc.text('N.° de factura', col3 + 5, infoY + 6)

    // Fila de valores
    doc.rect(50, infoY + 20, pageW, 18).fill('#ffffff')
    doc.fontSize(8).font('Helvetica').fillColor('#333333')
    doc.text(fmtDate(venta.fecha), col2 + 5, infoY + 25)
    doc.text(venta.numeroFactura, col4 + 5, infoY + 25)

    // Destinatario
    doc.rect(50, infoY + 38, pageW, 20).fill('#f0f0f0')
    doc.fontSize(7).font('Helvetica-Bold').fillColor('#444444')
    doc.text('Destinatario', col1 + 5, infoY + 44)
    doc.fontSize(8).font('Helvetica').fillColor('#333333')
    doc.text(venta.cliente?.nombre || 'Consumidor Final', col2 + 5, infoY + 44)
    if (venta.cliente?.identificacion) {
      doc.text(`ID: ${venta.cliente.identificacion}`, col3 + 5, infoY + 44)
    }

    // Descripción / Vendedor
    doc.rect(50, infoY + 58, pageW, 20).fill('#ffffff')
    doc.fontSize(7).font('Helvetica-Bold').fillColor('#444444')
    doc.text('Vendedor', col1 + 5, infoY + 64)
    doc.fontSize(8).font('Helvetica').fillColor('#333333')
    doc.text(venta.usuario?.nombre || '—', col2 + 5, infoY + 64)

    // ── TABLA DE PRODUCTOS ──────────────────
    const tableY = infoY + 95
    const colCant = 50, colDesc = 120, colPrecio = 370, colTotal = 460

    // Header de tabla
    doc.rect(50, tableY, pageW, 28).fill(accentColor)
    doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff')
    doc.text('Cantidad', colCant + 10, tableY + 9)
    doc.text('Descripción', colDesc + 10, tableY + 9)
    doc.text('Precio unitario', colPrecio + 5, tableY + 9)
    doc.text('Total', colTotal + 15, tableY + 9)

    // Filas de productos
    let rowY = tableY + 28
    venta.items.forEach((item, idx) => {
      const bg = idx % 2 === 0 ? '#ffffff' : '#fafafa'
      doc.rect(50, rowY, pageW, 22).fill(bg)
      doc.fontSize(8).font('Helvetica').fillColor('#333333')
      doc.text(String(item.cantidad), colCant + 10, rowY + 6, { width: 60 })
      doc.text(item.producto?.nombre || 'Producto', colDesc + 10, rowY + 6, { width: 240 })
      doc.text(`$${fmtMoney(item.precioUnit)}`, colPrecio + 5, rowY + 6, { width: 80 })
      doc.text(`$${fmtMoney(item.subtotal)}`, colTotal + 5, rowY + 6, { width: 80 })
      rowY += 22
    })

    // Filas vacías para completar al menos 5 filas
    const minFilas = Math.max(0, 5 - venta.items.length)
    for (let i = 0; i < minFilas; i++) {
      const bg = (venta.items.length + i) % 2 === 0 ? '#ffffff' : '#fafafa'
      doc.rect(50, rowY, pageW, 22).fill(bg)
      rowY += 22
    }

    // Línea bajo la tabla
    doc.moveTo(50, rowY).lineTo(50 + pageW, rowY)
       .strokeColor('#e0e0e0').lineWidth(0.5).stroke()

    // ── TOTALES ─────────────────────────────
    const totalesX = colPrecio - 30
    const totalesValX = colTotal + 5
    const totalesY = rowY + 12

    // Calcular IVA informativo del costo de compra
    let ivaTotal = 0
    venta.items.forEach(item => {
      ivaTotal += item.cantidad * (item.producto?.precioCompra || 0) * 19 / 119
    })

    doc.fontSize(8).font('Helvetica').fillColor('#555555')
    doc.text('Subtotal', totalesX, totalesY, { width: 90, align: 'right' })
    doc.text(`$${fmtMoney(venta.total)}`, totalesValX, totalesY, { width: 80 })

    doc.text('Impuesto (IVA costo)', totalesX, totalesY + 18, { width: 90, align: 'right' })
    doc.text(`$${fmtMoney(ivaTotal)}`, totalesValX, totalesY + 18, { width: 80 })

    // Total debido con fondo de acento
    doc.rect(totalesX - 5, totalesY + 38, pageW - totalesX + 55, 22).fill(accentColor)
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff')
    doc.text('Total debido', totalesX, totalesY + 43, { width: 90, align: 'right' })
    doc.text(`$${fmtMoney(venta.total)}`, totalesValX, totalesY + 43, { width: 80 })

    // ── FOOTER ──────────────────────────────
    const footerY = doc.page.height - 80
    doc.moveTo(50, footerY).lineTo(50 + pageW, footerY)
       .strokeColor('#e0e0e0').lineWidth(0.5).stroke()

    doc.fontSize(12).font('Helvetica-Bold')
       .fillColor(accentColor)
    const pieTexto = config.piePagina || '¡Gracias por su confianza!'
    const pieW = doc.widthOfString(pieTexto)
    doc.text(pieTexto, doc.page.width - pieW - 50, footerY + 15)

    doc.end()
  })
}

// ──────────────────────────────────────────────
//  Orquestador: obtener o generar factura
// ──────────────────────────────────────────────
export async function obtenerVentaParaFactura(ventaId) {
  const venta = await prisma.venta.findUnique({
    where: { id: ventaId },
    include: {
      cliente: true,
      usuario: { select: { nombre: true } },
      items: { include: { producto: true } }
    }
  })
  if (!venta) throw new Error('Venta no encontrada')

  const config = await getConfig()

  // Generar número de factura si no tiene
  if (!venta.numeroFactura) {
    const numero = await generarNumeroFactura()
    await prisma.venta.update({
      where: { id: ventaId },
      data: { numeroFactura: numero }
    })
    venta.numeroFactura = numero
  }

  // Generar y guardar XML si no existe
  if (!venta.xmlFactura) {
    const xml = generarXml(venta, config)
    await prisma.venta.update({
      where: { id: ventaId },
      data: { xmlFactura: xml }
    })
    venta.xmlFactura = xml
  }

  return { venta, config }
}

export async function obtenerPdf(ventaId) {
  const { venta, config } = await obtenerVentaParaFactura(ventaId)
  const pdfBuffer = await generarPdf(venta, config)
  return { pdfBuffer, venta }
}

export async function obtenerXml(ventaId) {
  const { venta } = await obtenerVentaParaFactura(ventaId)
  return venta.xmlFactura
}
