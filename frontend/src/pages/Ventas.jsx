import { useEffect, useState, useRef } from 'react'
import { ShoppingCart, Clock, User, ArrowUpRight, DollarSign, Package, Users, Calendar, Loader2, Search, FileText, X, Download, Code, ChevronDown, CheckCheck } from 'lucide-react'
import Button from '../components/common/Button'
import api from '../services/api'
import { getPdfBlobUrl, downloadPdf, getXmlText } from '../services/facturaService'

// ────────────────────────────────────────────
//  Modal Factura (PDF Viewer)
// ────────────────────────────────────────────
function ModalFactura({ venta, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [xmlText, setXmlText] = useState(null)
  const [showXml, setShowXml] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!venta) return
    setLoading(true)
    setError(null)
    getPdfBlobUrl(venta.id)
      .then(url => setPdfUrl(url))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl) }
  }, [venta?.id])

  if (!venta) return null

  const handleDownload = () => downloadPdf(venta.id, venta.numeroFactura)
  const handleShowXml = async () => {
    if (!xmlText) {
      try { setXmlText(await getXmlText(venta.id)) } catch (err) { setError(err.message); return }
    }
    setShowXml(!showXml)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-modal-in flex flex-col">
        <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
              <FileText className="text-orange-600" size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Factura {venta.numeroFactura || `V-${venta.id}`}</h2>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(venta.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShowXml} className="py-2 px-3 text-[10px] font-black uppercase tracking-widest text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-1.5 transition-all"><Code size={14} />{showXml ? 'Ver PDF' : 'Ver XML'}</button>
            <button onClick={handleDownload} className="py-2 px-3 text-[10px] font-black uppercase tracking-widest text-white bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.98]"><Download size={14} />Descargar PDF</button>
            <button onClick={onClose} className="p-2 hover:bg-orange-100 text-orange-600 rounded-full transition-colors ml-1"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-100">
          {loading ? (<div className="flex items-center justify-center h-full gap-3 text-gray-400"><Loader2 size={24} className="animate-spin" /><span className="text-xs font-bold uppercase tracking-widest">Generando factura...</span></div>
          ) : error ? (<div className="flex items-center justify-center h-full"><div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-6 py-4 rounded-2xl">{error}</div></div>
          ) : showXml ? (<div className="h-full overflow-auto custom-scrollbar p-6"><pre className="text-[11px] font-mono text-gray-700 bg-white p-6 rounded-2xl border border-gray-200 whitespace-pre-wrap break-words leading-relaxed">{xmlText || 'Cargando XML...'}</pre></div>
          ) : (<iframe src={pdfUrl} className="w-full h-full border-0" title={`Factura ${venta.numeroFactura}`} />)}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
//  Modal Detalle de Venta
// ────────────────────────────────────────────
function ModalDetalleVenta({ venta, onClose, onVerFactura }) {
  if (!venta) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-modal-in flex flex-col max-h-[90vh]">
        <div className="p-5 bg-orange-50 border-b border-orange-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2"><ShoppingCart className="text-orange-500" size={20} />Detalle de Venta V-{venta.id}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{new Date(venta.fecha).toLocaleString('es')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-orange-100 text-orange-600 rounded-full transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cliente</p>
              <p className="text-sm font-black text-gray-800">{venta.cliente?.nombre ?? 'Consumidor Final'}</p>
              {venta.cliente?.identificacion && <p className="text-xs font-bold text-gray-500 mt-0.5">ID: {venta.cliente.identificacion}</p>}
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vendedor</p>
              <p className="text-sm font-black text-gray-800">{venta.usuario?.nombre ?? '—'}</p>
              <p className="text-xs font-bold text-gray-500 mt-0.5">Estado: <span className={venta.estado === 'COMPLETADA' ? 'text-green-600' : 'text-red-600'}>{venta.estado}</span></p>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Productos Vendidos</h3>
            <div className="space-y-2">
              {venta.items?.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-800">{item.producto?.nombre ?? 'Producto Desconocido'}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.cantidad}x ${item.precioUnit.toLocaleString('es', {minimumFractionDigits: 2})}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">${item.subtotal.toLocaleString('es', {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
          </div>
          {venta.notas && (<div><h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Notas</h3><p className="text-xs font-bold text-gray-600 bg-orange-50/50 p-3 rounded-xl">{venta.notas}</p></div>)}
        </div>
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total de la Venta</p>
            <p className="text-2xl font-black text-gray-900">${venta.total.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
          </div>
          <button onClick={() => onVerFactura(venta)} className="py-2.5 px-5 text-xs font-black uppercase tracking-widest text-white bg-orange-500 hover:bg-orange-600 rounded-2xl flex items-center gap-2 transition-all active:scale-[0.98]">
            <FileText size={16} />Ver Factura
          </button>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
//  Filtro de fechas — presets + rango custom
// ────────────────────────────────────────────
const PRESETS = [
  { key: 'hoy',     label: 'Hoy' },
  { key: 'semana',  label: 'Esta semana' },
  { key: 'mes',     label: 'Este mes' },
  { key: 'custom',  label: 'Rango personalizado' },
  { key: 'todos',   label: 'Todos' },
]

function calcRango(key) {
  const now = new Date()
  if (key === 'hoy') {
    const d = new Date(now); d.setHours(0, 0, 0, 0)
    return { desde: d, hasta: now }
  }
  if (key === 'semana') {
    const d = new Date(now); d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0)
    return { desde: d, hasta: now }
  }
  if (key === 'mes') {
    const d = new Date(now.getFullYear(), now.getMonth(), 1)
    return { desde: d, hasta: now }
  }
  return { desde: null, hasta: null }
}

function FiltroFecha({ filtro, setFiltro, customDesde, setCustomDesde, customHasta, setCustomHasta }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const label = PRESETS.find(p => p.key === filtro)?.label ?? 'Filtrar fecha'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
          filtro !== 'todos' ? 'bg-orange-50 border-orange-300 text-orange-600' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-600'
        }`}
      >
        <Calendar size={15} />
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 min-w-[220px] animate-modal-in">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Período</p>
          <div className="space-y-0.5">
            {PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => { setFiltro(p.key); if (p.key !== 'custom') setOpen(false) }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-black transition-all ${
                  filtro === p.key ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p.label}
                {filtro === p.key && <CheckCheck size={12} />}
              </button>
            ))}
          </div>
          {filtro === 'custom' && (
            <div className="mt-3 space-y-2 border-t border-gray-50 pt-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Desde</label>
                <input type="date" value={customDesde} onChange={e => setCustomDesde(e.target.value)}
                  className="w-full border-2 border-gray-100 focus:border-orange-400 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none transition-all" />
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Hasta</label>
                <input type="date" value={customHasta} onChange={e => setCustomHasta(e.target.value)}
                  className="w-full border-2 border-gray-100 focus:border-orange-400 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none transition-all" />
              </div>
              <button onClick={() => setOpen(false)} className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all mt-1">
                Aplicar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────
//  Página Principal de Ventas
// ────────────────────────────────────────────
export default function Ventas() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)
  const [ventaFactura, setVentaFactura] = useState(null)

  // Filtro de fechas
  const [filtro, setFiltro] = useState('todos')
  const [customDesde, setCustomDesde] = useState('')
  const [customHasta, setCustomHasta] = useState('')

  useEffect(() => {
    api.get('/ventas')
      .then(r => setVentas(r.data))
      .catch(() => setError('No se pudieron cargar las ventas'))
      .finally(() => setLoading(false))
  }, [])

  // Calcular KPIs del día (siempre del día actual)
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const ventasHoy = ventas.filter(v => new Date(v.fecha) >= hoy && v.estado === 'COMPLETADA')
  const totalHoy  = ventasHoy.reduce((acc, v) => acc + v.total, 0)
  const unidadesHoy = ventasHoy.reduce((acc, v) => acc + (v.items?.reduce((s, i) => s + i.cantidad, 0) ?? 0), 0)
  const clientesHoy = new Set(ventasHoy.filter(v => v.clienteId).map(v => v.clienteId)).size

  // Aplicar filtro de fechas + búsqueda
  const ventasFiltradas = ventas.filter(v => {
    // Filtro de texto
    if (busqueda) {
      const iden = v.cliente?.identificacion?.toLowerCase() || ''
      const nom = v.cliente?.nombre?.toLowerCase() || ''
      const s = busqueda.toLowerCase()
      if (!iden.includes(s) && !nom.includes(s)) return false
    }
    // Filtro de fecha
    if (filtro === 'todos') return true
    if (filtro === 'custom') {
      const fecha = new Date(v.fecha)
      if (customDesde && fecha < new Date(customDesde + 'T00:00:00')) return false
      if (customHasta && fecha > new Date(customHasta + 'T23:59:59')) return false
      return true
    }
    const { desde, hasta } = calcRango(filtro)
    const fecha = new Date(v.fecha)
    if (desde && fecha < desde) return false
    if (hasta && fecha > hasta) return false
    return true
  })

  const handleVerFactura = (venta) => { setVentaSeleccionada(null); setVentaFactura(venta) }

  // Etiqueta de período activo para el encabezado
  const periodoLabel = filtro === 'todos' ? null
    : filtro === 'custom' ? (customDesde || customHasta) ? `${customDesde || '…'} → ${customHasta || '…'}` : null
    : PRESETS.find(p => p.key === filtro)?.label

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">

      <ModalDetalleVenta venta={ventaSeleccionada} onClose={() => setVentaSeleccionada(null)} onVerFactura={handleVerFactura} />
      <ModalFactura venta={ventaFactura} onClose={() => setVentaFactura(null)} />

      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3"><ShoppingCart className="text-orange-500" size={28} />Flujo de Ventas</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Control de transacciones y facturación</p>
        </div>
      </div>

      {error && (<div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">{error}</div>)}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><DollarSign size={24} /></div>
          <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Ventas de Hoy</p><p className="text-2xl font-black text-gray-800">${totalHoy.toLocaleString('es', { minimumFractionDigits: 2 })}</p></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Package size={24} /></div>
          <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Productos Salientes</p><p className="text-2xl font-black text-gray-800">{unidadesHoy} uds.</p></div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><Users size={24} /></div>
          <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Clientes Atendidos</p><p className="text-2xl font-black text-gray-800">{clientesHoy} Hoy</p></div>
        </div>
      </div>

      {/* Sales List */}
      <div className="card px-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
          <div className="shrink-0">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Historial Reciente</h2>
            {periodoLabel && (
              <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                <Calendar size={9} /> {periodoLabel} — {ventasFiltradas.length} registro{ventasFiltradas.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors pointer-events-none"><Search size={16} /></div>
              <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por cédula o nombre..."
                className="w-full bg-white border-2 border-gray-100 focus:border-orange-400 focus:bg-white rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-gray-700 outline-none transition-all" />
            </div>
            <FiltroFecha filtro={filtro} setFiltro={setFiltro} customDesde={customDesde} setCustomDesde={setCustomDesde} customHasta={customHasta} setCustomHasta={setCustomHasta} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 size={20} className="animate-spin" /><span className="text-xs font-bold uppercase">Cargando ventas...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left border-b border-gray-50">
                  <th className="px-6 py-4">ID / Fecha</th>
                  <th className="px-6 py-4">Cliente / Vendedor</th>
                  <th className="px-6 py-4">Productos</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ventasFiltradas.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-300 text-xs font-bold uppercase">
                    {busqueda || filtro !== 'todos' ? 'No se encontraron resultados para este filtro' : 'No hay ventas registradas'}
                  </td></tr>
                ) : (
                  ventasFiltradas.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-700">V-{v.id}</p>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                          <Clock size={10} /> {new Date(v.fecha).toLocaleDateString('es', {day:'2-digit', month:'short'})} · {new Date(v.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-[10px] font-black">{(v.cliente?.nombre ?? 'C').charAt(0)}</div>
                          <div>
                            <p className="text-[11px] font-bold text-gray-800">{v.cliente?.nombre ?? 'Consumidor Final'}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1"><User size={10} className="text-orange-400" /> {v.usuario?.nombre ?? '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-lg">{v.items?.length ?? 0} Items</span></td>
                      <td className="px-6 py-4"><p className="text-sm font-black text-gray-800">${v.total.toLocaleString('es', { minimumFractionDigits: 2 })}</p></td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${v.estado === 'COMPLETADA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          <div className={`w-1 h-1 rounded-full ${v.estado === 'COMPLETADA' ? 'bg-green-500' : 'bg-red-500'}`} />{v.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setVentaSeleccionada(v)} className="p-2 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"><ArrowUpRight size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
