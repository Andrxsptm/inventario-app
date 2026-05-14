import api from './api'

/**
 * Obtener el PDF de una factura como Blob URL (para iframe)
 */
export async function obtenerUrlBlobPdf(ventaId) {
  const res = await api.get(`/ventas/${ventaId}/factura/pdf`, {
    responseType: 'blob'
  })
  return URL.createObjectURL(res.data)
}

/**
 * Descargar el PDF directamente
 */
export async function descargarPdf(ventaId, numeroFactura) {
  const blobUrl = await obtenerUrlBlobPdf(ventaId)
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
export async function obtenerTextoXml(ventaId) {
  const res = await api.get(`/ventas/${ventaId}/factura/xml`, {
    responseType: 'text',
    transformResponse: [(data) => data] // Prevent axios from parsing XML as JSON
  })
  return res.data
}
