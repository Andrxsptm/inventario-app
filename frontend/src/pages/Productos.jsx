import { useEffect, useRef, useState } from 'react'
import {
  Plus, Search, Trash2, Package, Filter, Loader2, X,
  CheckCircle2, Tag, Truck, DollarSign, Layers, AlertCircle, ChevronDown
} from 'lucide-react'
import Button from '../components/common/Button'
import api from '../services/api'

/* ────────────────────────────────────────────────── */
/* Modal — Nuevo / Editar Producto                   */
/* (mismo patrón y estética que ModalProveedor)      */
/* ────────────────────────────────────────────────── */
function ModalProducto({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id

  const [form, setForm] = useState({
    nombre:      initial?.nombre      ?? '',
    proveedorId: initial?.proveedorId ?? '',
    precioCompra: initial?.precioCompra ?? '',
    precioVenta:  initial?.precioVenta  ?? '',
    stockActual:  initial?.stockActual  ?? '',
    stockMinimo:  initial?.stockMinimo  ?? 5,
  })

  const [proveedores, setProveedores] = useState([])
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.get('/proveedores').then(r => setProveedores(r.data.filter(p => p.activo))).catch(() => {})
  }, [])

  async function manejarGuardado() {
    if (!form.nombre.trim())   { setError('El nombre es obligatorio.');          return }
    if (!form.proveedorId)     { setError('Selecciona un proveedor.');           return }
    if (!form.precioCompra || Number(form.precioCompra) <= 0) { setError('El precio de compra es obligatorio y debe ser mayor a 0.'); return }
    if (!form.precioVenta  || Number(form.precioVenta)  <= 0) { setError('El precio de venta es obligatorio y debe ser mayor a 0.');  return }

    setSaving(true); setError('')
    try {
      const payload = {
        nombre:      form.nombre.trim(),
        proveedorId: Number(form.proveedorId),
        precioCompra: Number(form.precioCompra) || 0,
        precioVenta:  Number(form.precioVenta)  || 0,
        stockActual:  isEdit ? initial.stockActual : (Number(form.stockActual) || 0),
        stockMinimo:  Number(form.stockMinimo)  || 0,
      }
      if (isEdit) {
        await api.put(`/productos/${initial.id}`, payload)
      } else {
        await api.post('/productos', payload)
      }
      setSuccess(true)
      setTimeout(() => { onSaved(); onClose() }, 1200)
    } catch {
      setError('Error al guardar el producto.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none transition-all'
  const iconCls  = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors'

  /* Campos — mismo patrón .map() que ModalProveedor */
  const textFields = [
    { label: 'Nombre del Producto *', key: 'nombre',       icon: Tag,         type: 'text',   placeholder: 'Ej. Teclado Mecánico RGB...' },
    { label: 'Precio de Compra ($) *',  key: 'precioCompra',  icon: DollarSign,  type: 'number', placeholder: '0.00', step: '0.01', min: '0' },
    { label: 'Precio de Venta ($) *',   key: 'precioVenta',   icon: DollarSign,  type: 'number', placeholder: '0.00', step: '0.01', min: '0' },
    { label: 'Stock Mínimo',          key: 'stockMinimo',   icon: AlertCircle, type: 'number', placeholder: '5',    min: '0' },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      {/* mismo max-w-lg + rounded-3xl que ModalProveedor */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-modal-in">

        {/* Header — idéntico: amber-50, amber-100, amber-500, rounded-full */}
        <div className="p-5 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Package className="text-amber-500" size={20} />
              {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {isEdit ? 'Actualiza los datos del artículo' : 'Registrar artículo en inventario'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-100 text-amber-600 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Success */}
        {success ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xs font-black text-green-600 uppercase tracking-tighter">
              {isEdit ? '¡Producto actualizado!' : '¡Producto creado!'}
            </p>
          </div>
        ) : (
          <>
            {/* Body — max-h igual a la altura natural de ModalProveedor (5 campos), scroll si hay más */}
            <div className="p-6 space-y-4 max-h-[424px] overflow-y-auto custom-scrollbar">

              {textFields.map(({ label, key, icon: Icon, type, placeholder, step, min }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
                  <div className="relative group">
                    <div className={iconCls}><Icon size={16} /></div>
                    <input
                      type={type} step={step} min={min}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}

              {/* Proveedor — select con icono */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proveedor Principal *</label>
                <div className="relative group">
                  <div className={`${iconCls} pointer-events-none`}><Truck size={16} /></div>
                  <select
                    value={form.proveedorId}
                    onChange={e => setForm({ ...form, proveedorId: e.target.value })}
                    className={`${inputCls} appearance-none cursor-pointer pr-10`}
                  >
                    <option value="">Selecciona un proveedor</option>
                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-focus-within:text-amber-500 transition-colors">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Stock inicial solo al crear */}
              {!isEdit && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Inicial</label>
                  <div className="relative group">
                    <div className={iconCls}><Layers size={16} /></div>
                    <input
                      type="number" min="0" placeholder="0"
                      value={form.stockActual}
                      onChange={e => setForm({ ...form, stockActual: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}
            </div>

            {/* Footer — idéntico a ModalProveedor */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={manejarGuardado}
                disabled={saving}
                className="flex-[2] py-2.5 text-xs font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-60 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Guardar Producto'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────── */
/* KPI Card — un producto                            */
/* ────────────────────────────────────────────────── */
function TarjetaProductoCatalogo({ producto: p, onEdit, onDelete }) {
  const stockOk  = p.stockActual > p.stockMinimo
  const margin   = p.precioCompra > 0
    ? (((p.precioVenta - p.precioCompra) / p.precioCompra) * 100).toFixed(0)
    : 0

  return (
    <div className="group bg-white p-5 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col">

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 group-hover:scale-110 transition-transform shrink-0">
          <Package size={22} />
        </div>
        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest ${
          stockOk ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {stockOk ? 'Stock OK' : p.stockActual === 0 ? 'Agotado' : 'Stock bajo'}
        </span>
      </div>

      {/* Name + SKU */}
      <h3 className="font-black text-gray-800 text-sm leading-tight line-clamp-2 mb-1">{p.nombre}</h3>
      <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">
        SKU: PRD-{String(p.id).padStart(3, '0')}
      </p>
      <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-5">
        <Truck size={11} className="text-gray-300 shrink-0" />
        <span className="truncate">{p.proveedor?.nombre ?? '—'}</span>
      </div>

      {/* Price / Stock KPIs */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-[8.5px] text-gray-400 uppercase font-black tracking-widest leading-tight mb-1">Compra</p>
          <p className="text-xs font-black text-gray-700">${p.precioCompra.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-2.5 text-center">
          <p className="text-[8.5px] text-blue-400 uppercase font-black tracking-widest leading-tight mb-1">Venta</p>
          <p className="text-xs font-black text-blue-700">${p.precioVenta.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="text-[8.5px] text-gray-400 uppercase font-black tracking-widest leading-tight mb-1">Margen</p>
          <p className={`text-xs font-black ${Number(margin) >= 20 ? 'text-green-600' : 'text-amber-600'}`}>
            {margin}%
          </p>
        </div>
      </div>

      {/* Stock bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
          <span>Stock actual</span>
          <span className={stockOk ? 'text-green-600' : 'text-red-500'}>
            {p.stockActual} / mín {p.stockMinimo}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${stockOk ? 'bg-blue-400' : 'bg-red-400'}`}
            style={{ width: `${Math.min((p.stockActual / Math.max(p.stockMinimo * 2, 1)) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-50">
        <button
          onClick={() => onEdit(p)}
          className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(p)}
          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────── */
/* Página principal                                  */
/* ────────────────────────────────────────────────── */
const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'ok',   label: 'Stock OK' },
  { value: 'bajo', label: 'Stock Bajo' },
  { value: 'agotado', label: 'Agotado' },
]

export default function Productos() {
  const [productos,   setProductos]   = useState([])
  const [proveedores, setProveedores] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState('')
  const [modal,       setModal]       = useState(null)
  const [confirmDel,  setConfirmDel]  = useState(null)
  const [delError,    setDelError]    = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [expandido,   setExpandido]   = useState(false)
  const LIMITE_VISTA = 8

  const [filters, setFilters] = useState({
    stockDir: '',    // '' | 'gt' | 'lt'
    stockVal: '',
    estado:   '',
    proveedorId: '',
  })

  function establecerFiltro(key, val) { setFilters(f => ({ ...f, [key]: val })) }

  const activeCount = [
    filters.stockDir && filters.stockVal !== '',
    filters.estado !== '',
    filters.proveedorId !== '',
  ].filter(Boolean).length

  function limpiarFiltros() {
    setFilters({ stockDir: '', stockVal: '', estado: '', proveedorId: '' })
  }

  function cargar() {
    setLoading(true)
    api.get('/productos')
      .then(r => setProductos(r.data))
      .catch(() => setError('No se pudieron cargar los productos'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()
    api.get('/proveedores').then(r => setProveedores(r.data.filter(p => p.activo))).catch(() => {})
  }, [])

  async function eliminar(p) {
    try {
      await api.delete(`/productos/${p.id}`)
      setConfirmDel(null)
      setDelError('')
      cargar()
    } catch (e) {
      const msg = e?.response?.data?.error || 'Error al eliminar producto'
      setDelError(msg)
    }
  }

  const filtered = productos.filter(p => {
    if (search && !p.nombre.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.proveedorId && p.proveedorId !== parseInt(filters.proveedorId)) return false
    if (filters.estado) {
      const ok  = p.stockActual > p.stockMinimo
      const ago = p.stockActual === 0
      if (filters.estado === 'ok'      && !ok)          return false
      if (filters.estado === 'agotado' && !ago)         return false
      if (filters.estado === 'bajo'    && (ok || ago))  return false
    }
    if (filters.stockDir && filters.stockVal !== '') {
      const v = Number(filters.stockVal)
      if (filters.stockDir === 'gt' && !(p.stockActual > v))  return false
      if (filters.stockDir === 'lt' && !(p.stockActual < v))  return false
    }
    return true
  })

  const productosVisibles = expandido ? filtered : filtered.slice(0, LIMITE_VISTA)
  const hayMas = !loading && filtered.length > LIMITE_VISTA

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">

      {/* Modal crear/editar */}
      {modal && (
        <ModalProducto
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={cargar}
        />
      )}

      {/* Confirm delete */}
      {confirmDel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => { setConfirmDel(null); setDelError('') }} />
          <div className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-xs p-6 animate-in zoom-in-95 fade-in duration-200 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter">¿Eliminar producto?</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-3">
              Solo se puede eliminar con stock = 0.
            </p>
            {delError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-xl mb-3 text-left">
                {delError}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => { setConfirmDel(null); setDelError('') }}
                className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(confirmDel)}
                className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all active:scale-[0.98]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <Package className="text-blue-500" size={28} />
            Catálogo de Productos
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
            Gestiona el inventario maestro de tu negocio
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={() => setModal('new')} icon={Plus}>
            Nuevo Producto
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Search + Filter dropdown */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm focus-within:border-blue-300 transition-all">
          <Search size={18} className="text-gray-300 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre del producto..."
            className="bg-transparent border-none outline-none text-sm w-full font-medium text-gray-700 placeholder-gray-300"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter button + popover */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest shadow-sm transition-all ${
              showFilters || activeCount > 0
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Filter size={15} /> Filtros
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          {showFilters && (
            <>
              {/* Overlay para cerrar al hacer clic fuera */}
              <div className="fixed inset-0 z-[9]" onClick={() => setShowFilters(false)} />

              {/* Popover flotante */}
              <div className="absolute right-0 top-full mt-2 z-10 w-72 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 p-4 animate-in zoom-in-95 fade-in slide-in-from-top-2 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Filter size={12} /> Filtros
                  </p>
                  {activeCount > 0 && (
                    <button
                      onClick={limpiarFiltros}
                      className="text-[9px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      <X size={10} /> Limpiar todo
                    </button>
                  )}
                </div>

                <div className="space-y-4">

                  {/* Stock */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cantidad de stock</label>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => establecerFiltro('stockDir', filters.stockDir === 'gt' ? '' : 'gt')}
                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                          filters.stockDir === 'gt'
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        &gt; Mayor
                      </button>
                      <button
                        onClick={() => establecerFiltro('stockDir', filters.stockDir === 'lt' ? '' : 'lt')}
                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                          filters.stockDir === 'lt'
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        &lt; Menor
                      </button>
                    </div>
                    <input
                      type="number" min={0}
                      placeholder="Valor de stock..."
                      value={filters.stockVal}
                      onChange={e => establecerFiltro('stockVal', e.target.value)}
                      disabled={!filters.stockDir}
                      className="w-full bg-gray-50 border-2 border-gray-100 focus:border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Estado */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Estado</label>
                    <div className="flex flex-wrap gap-1.5">
                      {ESTADOS.map(e => (
                        <button
                          key={e.value}
                          onClick={() => establecerFiltro('estado', filters.estado === e.value ? '' : e.value)}
                          className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                            filters.estado === e.value
                              ? 'bg-blue-50 border-blue-300 text-blue-600'
                              : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                          }`}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Proveedor */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Proveedor</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => establecerFiltro('proveedorId', '')}
                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                          filters.proveedorId === ''
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        Todos
                      </button>
                      {proveedores.map(pv => (
                        <button
                          key={pv.id}
                          onClick={() => establecerFiltro('proveedorId', filters.proveedorId === String(pv.id) ? '' : String(pv.id))}
                          className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                            filters.proveedorId === String(pv.id)
                              ? 'bg-blue-50 border-blue-300 text-blue-600'
                              : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                          }`}
                        >
                          {pv.nombre}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-3xl border border-gray-100 h-64" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-300">
          <Package size={40} strokeWidth={1.5} />
          <p className="text-xs font-black uppercase tracking-widest">
            {productos.length === 0 ? 'No hay productos registrados' : 'Sin resultados'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pr-1 ${
            expandido ? 'max-h-[60vh] lg:max-h-[780px] overflow-y-auto custom-scrollbar' : ''
          }`}>
            {productosVisibles.map(p => (
              <TarjetaProductoCatalogo
                key={p.id}
                producto={p}
                onEdit={prod => setModal(prod)}
                onDelete={prod => setConfirmDel(prod)}
              />
            ))}
          </div>

          {hayMas && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setExpandido(v => !v)}
                className="flex items-center gap-2 px-8 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black text-[11px] uppercase tracking-widest rounded-full transition-all active:scale-[0.97] shadow-sm"
              >
                {expandido ? 'Ver menos' : 'Ver todos'}
                <span
                  className="inline-block transition-transform duration-200"
                  style={{ transform: expandido ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  →
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
