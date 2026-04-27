import { useEffect, useState } from 'react'
import { ShoppingBag, Truck, Tag, ChevronRight, Loader2, X, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import api from '../services/api'
import Button from '../components/common/Button'

function ModalNuevaOrden({ onClose, onCreated }) {
  const [proveedores, setProveedores] = useState([])
  const [productos,   setProductos]   = useState([])
  const [proveedorId, setProveedorId] = useState('')
  const [notas,       setNotas]       = useState('')
  const [items,       setItems]       = useState([])
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)

  useEffect(() => {
    api.get('/proveedores').then(r => setProveedores(r.data.filter(p => p.activo))).catch(() => {})
    api.get('/productos').then(r => setProductos(r.data)).catch(() => {})
  }, [])

  function addItem() {
    setItems(prev => [...prev, { productoId: '', cantidad: 1, precioUnit: 0 }])
  }

  function updateItem(idx, field, val) {
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it
      const updated = { ...it, [field]: field === 'productoId' ? val : Number(val) }
      if (field === 'productoId') {
        const p = productos.find(p => p.id === parseInt(val))
        updated.precioUnit = p?.precioCompra ?? 0
      }
      return updated
    }))
  }

  function removeItem(idx) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const total = items.reduce((acc, i) => acc + i.cantidad * i.precioUnit, 0)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!proveedorId) { setError('Selecciona un proveedor.'); return }
    if (items.length === 0) { setError('Agrega al menos un producto.'); return }
    if (items.some(i => !i.productoId || i.cantidad < 1)) { setError('Completa todos los productos.'); return }
    setSaving(true); setError('')
    try {
      await api.post('/compras', { proveedorId: parseInt(proveedorId), notas, items })
      setSuccess(true)
      setTimeout(() => { onCreated(); onClose() }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la orden.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col animate-in zoom-in-95 fade-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
              <ShoppingBag size={14} className="text-purple-500" /> Nueva Orden de Compra
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Crea una orden de abastecimiento</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-14">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xs font-black text-green-600 uppercase tracking-tighter">¡Orden creada exitosamente!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto custom-scrollbar flex-1 p-6 space-y-4">

              {/* Proveedor */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Proveedor *</label>
                <select
                  value={proveedorId}
                  onChange={e => setProveedorId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                >
                  <option value="">— Seleccionar proveedor —</option>
                  {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Productos</label>
                  <button type="button" onClick={addItem} className="flex items-center gap-1 text-[10px] font-black text-violet-600 bg-violet-50 hover:bg-violet-100 px-2.5 py-1 rounded-lg transition-colors">
                    <Plus size={11} /> Agregar
                  </button>
                </div>

                {items.length === 0 ? (
                  <p className="text-[10px] text-gray-300 font-bold text-center py-4 uppercase tracking-widest">Sin productos aún</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                        <select
                          value={it.productoId}
                          onChange={e => updateItem(idx, 'productoId', e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 min-w-0"
                        >
                          <option value="">— Producto —</option>
                          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                        <input
                          type="number" min={1} value={it.cantidad}
                          onChange={e => updateItem(idx, 'cantidad', e.target.value)}
                          placeholder="Cant."
                          className="w-16 text-center text-xs font-black text-gray-800 bg-white border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                        />
                        <input
                          type="number" min={0} step="0.01" value={it.precioUnit}
                          onChange={e => updateItem(idx, 'precioUnit', e.target.value)}
                          placeholder="Precio"
                          className="w-20 text-center text-xs font-black text-gray-800 bg-white border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                        />
                        <button type="button" onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notas */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Notas (opcional)</label>
                <textarea
                  rows={2} value={notas}
                  onChange={e => setNotas(e.target.value)}
                  placeholder="Observaciones sobre la orden..."
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
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total estimado</p>
                <p className="text-xl font-black text-gray-900">${total.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={onClose} disabled={saving}
                  className="px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.98]">
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <ShoppingBag size={13} />}
                  {saving ? 'Guardando...' : 'Crear Orden'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Compras() {
  const [compras,    setCompras]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [showModal,  setShowModal]  = useState(false)

  function load() {
    setLoading(true)
    api.get('/compras')
      .then(r => setCompras(r.data))
      .catch(() => setError('No se pudieron cargar las órdenes de compra'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">

      {showModal && <ModalNuevaOrden onClose={() => setShowModal(false)} onCreated={load} />}

      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <ShoppingBag className="text-purple-500" size={28} />
            Órdenes de Compra
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Abastecimiento y logística de entrada</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          icon={ShoppingBag}
        >
          Generar Orden
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs font-bold uppercase">Cargando órdenes...</span>
        </div>
      ) : compras.length === 0 ? (
        <p className="text-center text-gray-300 text-sm font-bold py-10">No hay órdenes de compra registradas</p>
      ) : (
        <div className="space-y-4">
          {compras.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:translate-x-2 transition-transform">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-50">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800">OC-{String(c.id).padStart(3, '0')}</h3>
                  <p className="text-xs text-gray-400 uppercase font-black">{new Date(c.fecha).toLocaleDateString('es')}</p>
                </div>
              </div>

              <div className="flex-1 lg:px-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-bold mb-1">
                  <Truck size={16} className="text-indigo-400" /> {c.proveedor?.nombre ?? '—'}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Tag size={14} /> {c.items?.length ?? 0} Productos en la orden
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Inversión</p>
                  <p className="text-2xl font-black text-gray-900">${c.total.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest ${
                  c.estado === 'RECIBIDA'  ? 'bg-green-100 text-green-700'  :
                  c.estado === 'CANCELADA' ? 'bg-red-100 text-red-700'     :
                                             'bg-amber-100 text-amber-700'
                }`}>
                  {c.estado}
                </div>
                <button className="p-3 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
