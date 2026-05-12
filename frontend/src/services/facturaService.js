import api from './api'

/**
 * Obtener el PDF de una factura como Blob URL (para iframe)
 */
export async function getPdfBlobUrl(ventaId) {
  const res = await api.get(`/ventas/${ventaId}/factura/pdf`, {
    responseType: 'blob'
  })
  return URL.createObjectURL(res.data)
}

/**
 * Descargar el PDF directamente
 */
export async function downloadPdf(ventaId, numeroFactura) {
  const blobUrl = await getPdfBlobUrl(ventaId)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = `${numeroFactura || 'factura'}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(blobUrl)
}

/**
 * Obtener el XML de la factura como texto
 */
export async function getXmlText(ventaId) {
  const res = await api.get(`/ventas/${ventaId}/factura/xml`, {
    responseType: 'text',
    transformResponse: [(data) => data] // Prevent axios from parsing XML as JSON
  })
  return res.data
}
