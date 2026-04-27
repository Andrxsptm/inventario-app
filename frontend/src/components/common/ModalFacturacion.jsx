import { useState, useEffect, useRef } from 'react'
import { X, FileText, User, Search, Plus, Trash2, Loader2, CheckCircle2, ChevronDown } from 'lucide-react'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'

const EMPTY_FORM = { nombre: '', telefono: '', correo: '', direccion: '' }

export default function ModalFacturacion({ onClose }) {
  const { user } = useAuthStore()

  /* clientes */
  const [clientes,       setClientes]       = useState([])
  const [clienteQuery,   setClienteQuery]   = useState('')
  const [clienteSel,     setClienteSel]     = useState(null)   // objeto cliente existente
  const [nuevoCliente,   setNuevoCliente]   = useState(EMPTY_FORM)
  const [showSuggestions,setShowSuggestions]= useState(false)
  const [modoNuevo,      setModoNuevo]      = useState(false)

  /* productos */
  const [productos,  setProductos]  = useState([])
  const [items,      setItems]      = useState([])            // [{producto, cantidad}]

  /* ui */
  const [notas,    setNotas]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    api.get('/clientes').then(r => setClientes(r.data)).catch(() => {})
    api.get('/productos').then(r => setProductos(r.data)).catch(() => {})
  }, [])

  /* ── Cliente autocomplete ── */
  const suggestions = clientes.filter(c =>
    c.nombre.toLowerCase().includes(clienteQuery.toLowerCase()) ||
    (c.correo ?? '').toLowerCase().includes(clienteQuery.toLowerCase())
  ).slice(0, 6)

  function seleccionarCliente(c) {
    setClienteSel(c)
    setClienteQuery(c.nombre)
    setShowSuggestions(false)
    setModoNuevo(false)
  }

  function activarNuevoCliente() {
    setClienteSel(null)
    setModoNuevo(true)
    setShowSuggestions(false)
    setNuevoCliente({ ...EMPTY_FORM, nombre: clienteQuery })
  }

  /* ── Items ── */
  function addItem(producto) {
    setItems(prev => {
      const exists = prev.find(i => i.producto.id === producto.id)
      if (exists) return prev.map(i => i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { producto, cantidad: 1 }]
    })
  }

  function updateCantidad(id, val) {
    const n = parseInt(val)
    if (isNaN(n) || n < 1) return
    setItems(prev => prev.map(i => i.producto.id === id ? { ...i, cantidad: n } : i))
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.producto.id !== id))
  }

  const total = items.reduce((acc, i) => acc + i.producto.precioVenta * i.cantidad, 0)

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault()
    if (items.length === 0) { setError('Agrega al menos un producto.'); return }
    setSaving(true); setError('')

    try {
      let clienteId = clienteSel?.id ?? null

      /* Si es nuevo cliente, crearlo primero */
      if (modoNuevo) {
        if (!nuevoCliente.nombre.trim()) { setError('El nombre del cliente es obligatorio.'); setSaving(false); return }
        const { data: nc } = await api.post('/clientes', nuevoCliente)
        clienteId = nc.id
      }

      await api.post('/ventas', {
        clienteId,
        notas,
        items: items.map(i => ({
          productoId: i.producto.id,
          cantidad: i.cantidad,
          precioUnit: i.producto.precioVenta,
        })),
      })

      setSuccess(true)
      setTimeout(onClose, 1800)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la venta.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95 fade-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
              <FileText size={15} className="text-violet-500" /> Nueva Factura / Venta
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Vendedor: {user?.nombre ?? '—'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-sm font-black text-green-600 uppercase tracking-tighter">¡Venta registrada exitosamente!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto custom-scrollbar flex-1 p-6 space-y-5">

              {/* ── Cliente ── */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Cliente
                </label>

                {/* Search input */}
                <div className="relative" ref={searchRef}>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5">
                    <Search size={14} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={clienteQuery}
                      onChange={e => { setClienteQuery(e.target.value); setShowSuggestions(true); setClienteSel(null); setModoNuevo(false) }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Buscar cliente existente..."
                      className="bg-transparent outline-none text-sm font-medium text-gray-800 w-full placeholder-gray-300"
                    />
                    {clienteSel && <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">Existente</span>}
                  </div>

                  {/* Suggestions dropdown */}
                  {showSuggestions && clienteQuery.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-xl z-10 overflow-hidden">
                      {suggestions.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => seleccionarCliente(c)}
                          className="w-full text-left px-4 py-2.5 hover:bg-violet-50 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-bold text-gray-800 group-hover:text-violet-700">{c.nombre}</p>
                            <p className="text-[10px] text-gray-400">{c.correo ?? c.telefono ?? '—'}</p>
                          </div>
                          <ChevronDown size={12} className="-rotate-90 text-gray-300 group-hover:text-violet-400" />
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={activarNuevoCliente}
                        className="w-full text-left px-4 py-2.5 hover:bg-violet-50 transition-colors flex items-center gap-2 border-t border-gray-50"
                      >
                        <Plus size={14} className="text-violet-500" />
                        <span className="text-xs font-black text-violet-600">Crear nuevo cliente "{clienteQuery}"</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Nuevo cliente form inline */}
                {modoNuevo && (
                  <div className="mt-3 p-4 bg-violet-50/50 border border-violet-100 rounded-xl space-y-3">
                    <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Nuevo cliente</p>
                    {[
                      { key: 'nombre', label: 'Nombre *', placeholder: 'Nombre completo' },
                      { key: 'telefono', label: 'Teléfono', placeholder: '+57...' },
                      { key: 'correo', label: 'Correo', placeholder: 'correo@ejemplo.com' },
                      { key: 'direccion', label: 'Dirección', placeholder: 'Calle...' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{label}</label>
                        <input
                          type="text"
                          value={nuevoCliente[key]}
                          onChange={e => setNuevoCliente(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Productos ── */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                  Productos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                  {productos.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addItem(p)}
                      disabled={p.stockActual === 0}
                      className="text-left p-2.5 bg-gray-50 hover:bg-violet-50 border border-gray-100 hover:border-violet-200 rounded-xl transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <p className="text-[11px] font-black text-gray-800 group-hover:text-violet-700 line-clamp-1">{p.nombre}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">${p.precioVenta.toFixed(2)} · {p.stockActual} uds</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Items seleccionados ── */}
              {items.length > 0 && (
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                    Orden ({items.length} ítems)
                  </label>
                  <div className="space-y-2">
                    {items.map(i => (
                      <div key={i.producto.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-gray-800 truncate">{i.producto.nombre}</p>
                          <p className="text-[10px] text-gray-400">${i.producto.precioVenta.toFixed(2)} c/u</p>
                        </div>
                        <input
                          type="number"
                          min={1}
                          max={i.producto.stockActual}
                          value={i.cantidad}
                          onChange={e => updateCantidad(i.producto.id, e.target.value)}
                          className="w-14 text-center text-sm font-black text-gray-800 bg-white border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                        />
                        <p className="text-xs font-black text-gray-700 w-16 text-right">
                          ${(i.producto.precioVenta * i.cantidad).toFixed(2)}
                        </p>
                        <button type="button" onClick={() => removeItem(i.producto.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Notas ── */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Notas (opcional)</label>
                <textarea
                  rows={2}
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                  placeholder="Observaciones..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4 shrink-0 bg-gray-50/50">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total</p>
                <p className="text-xl font-black text-gray-900">${total.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || items.length === 0}
                  className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
                  {saving ? 'Guardando...' : 'Registrar Venta'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
