import { useEffect, useState } from 'react'
import { ShoppingBag, Truck, Tag, ChevronRight, ChevronDown, Loader2, X, Plus, Trash2, CheckCircle2, Search, Filter } from 'lucide-react'
import api from '../services/api'
import Button from '../components/common/Button'

function ModalNuevaOrden({ onClose, onCreated }) {
  const [proveedores, setProveedores] = useState([])
  const [productos,   setProductos]   = useState([])
  const [proveedorId, setProveedorId] = useState('')
  const productosFiltrados = proveedorId
    ? productos.filter(p => p.proveedorId === parseInt(proveedorId))
    : []
  const [notas,       setNotas]       = useState('')
  const [fechaEntrega,setFechaEntrega]= useState('')
  const [items,       setItems]       = useState([])
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)

  useEffect(() => {
    api.get('/proveedores').then(r => setProveedores(r.data.filter(p => p.activo))).catch(() => {})
    api.get('/productos').then(r => setProductos(r.data)).catch(() => {})
  }, [])

  function agregarItem() {
    setItems(prev => [...prev, { productoId: '', cantidad: 1, precioUnit: 0 }])
  }

  function actualizarItem(idx, field, val) {
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

  function eliminarItem(idx) {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const total = items.reduce((acc, i) => acc + i.cantidad * i.precioUnit, 0)

  async function manejarEnvio(e) {
    e.preventDefault()
    if (!proveedorId) { setError('Selecciona un proveedor.'); return }
    if (items.length === 0) { setError('Agrega al menos un producto.'); return }
    if (items.some(i => !i.productoId || i.cantidad < 1)) { setError('Completa todos los productos.'); return }
    setSaving(true); setError('')
    try {
      await api.post('/compras', { proveedorId: parseInt(proveedorId), notas, fechaEntrega: fechaEntrega || null, items })
      setSuccess(true)
      setTimeout(() => { onCreated(); onClose() }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la orden.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none transition-all'
  const iconCls  = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors pointer-events-none'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-modal-in">

        {/* Header — mismo estilo que ModalProveedor, color amber */}
        <div className="p-5 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <ShoppingBag className="text-amber-500" size={20} />
              Nueva Orden de Compra
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Registrar abastecimiento de inventario
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-100 text-amber-600 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xs font-black text-green-600 uppercase tracking-tighter">¡Orden creada exitosamente!</p>
          </div>
        ) : (
          <>
            {/* Body */}
            <form onSubmit={manejarEnvio}>
              <div className="p-6 space-y-4 max-h-[424px] overflow-y-auto custom-scrollbar">

                {/* Proveedor */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proveedor *</label>
                  <div className="relative group">
                    <div className={iconCls}><Truck size={16} /></div>
                    <select
                      value={proveedorId}
                      onChange={e => { setProveedorId(e.target.value); setItems([]) }}
                      className={`${inputCls} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="">Seleccionar proveedor</option>
                      {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-focus-within:text-amber-500 transition-colors">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                {/* Notas */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notas (opcional)</label>
                  <div className="relative group">
                    <div className={`${iconCls} top-4 translate-y-0`}><Tag size={16} /></div>
                    <textarea
                      rows={2}
                      value={notas}
                      onChange={e => setNotas(e.target.value)}
                      placeholder="Observaciones sobre la orden..."
                      className="w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none transition-all resize-none placeholder-gray-300"
                    />
                  </div>
                </div>

                {/* Fecha de Entrega */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha Estimada de Entrega</label>
                  <div className="relative group">
                    <input
                      type="date"
                      value={fechaEntrega}
                      onChange={e => setFechaEntrega(e.target.value)}
                      className={`${inputCls} !pl-4`}
                    />
                  </div>
                </div>

                {/* Productos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Productos de la Orden</label>
                    <Button
                      type="button"
                      onClick={agregarItem}
                      variant="amber"
                      icon={Plus}
                      className="!px-3 !py-1.5"
                      disabled={!proveedorId}
                      title={!proveedorId ? 'Selecciona un proveedor primero' : 'Agregar producto'}
                    />
                  </div>

                  {/* Cabecera de columnas */}
                  {items.length > 0 && (
                    <div className="flex items-center gap-2 px-2.5">
                      <span className="flex-1 min-w-0 text-[9px] font-black text-gray-400 uppercase tracking-widest">Producto</span>
                      <span className="w-16 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Cantidad</span>
                      <span className="w-20 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Precio</span>
                      <span className="w-6" />
                    </div>
                  )}

                  {items.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                      <ShoppingBag size={22} className="text-gray-200" />
                      <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">
                        {proveedorId ? 'Sin productos aún — pulsa + para agregar' : 'Selecciona un proveedor primero'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 border-2 border-gray-50 rounded-2xl p-2.5">
                          <div className="relative flex-1 min-w-0 group/select">
                            <select
                              value={it.productoId}
                              onChange={e => actualizarItem(idx, 'productoId', e.target.value)}
                              className="w-full appearance-none cursor-pointer bg-white border-2 border-gray-100 focus:border-amber-400 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-gray-700 outline-none transition-all shadow-sm hover:border-gray-200"
                            >
                              <option value="">Seleccionar producto</option>
                              {productosFiltrados.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-focus-within/select:text-amber-500 transition-colors">
                              <ChevronDown size={14} />
                            </div>
                          </div>
                          <input
                            type="number" min={1} value={it.cantidad}
                            onChange={e => actualizarItem(idx, 'cantidad', e.target.value)}
                            placeholder="Cant."
                            className="w-16 text-center text-xs font-black text-gray-700 bg-white border-2 border-gray-100 focus:border-amber-400 rounded-xl py-2 outline-none transition-all shadow-sm hover:border-gray-200"
                          />
                          <input
                            type="number" min={0} step="0.01" value={it.precioUnit}
                            onChange={e => actualizarItem(idx, 'precioUnit', e.target.value)}
                            placeholder="Precio"
                            className="w-20 text-center text-xs font-black text-gray-700 bg-white border-2 border-gray-100 focus:border-amber-400 rounded-xl py-2 outline-none transition-all shadow-sm hover:border-gray-200"
                          />
                          <button type="button" onClick={() => eliminarItem(idx)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-xl">
                    {error}
                  </div>
                )}
              </div>

              {/* Footer — mismo patrón: bg-gray-50, total a la izq, botones a la der */}
              <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total estimado</p>
                  <p className="text-xl font-black text-gray-900">${total.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="flex-1 py-2.5 px-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2.5 px-5 text-xs font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-60 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {saving && <Loader2 size={13} className="animate-spin" />}
                    {saving ? 'Guardando' : 'Crear Orden'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function ModalDetalleOrden({ orden, onClose }) {
  if (!orden) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-modal-in">
        <div className="p-6 bg-amber-50 border-b border-amber-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <ShoppingBag className="text-amber-500" size={24} />
              Orden de Compra OC-{String(orden.id).padStart(3, '0')}
            </h2>
            <div className="flex gap-4 mt-2">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Truck size={14} className="text-amber-500"/> {orden.proveedor?.nombre ?? '—'}
              </p>
              <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-widest ${
                orden.estado === 'RECIBIDA'  ? 'bg-green-100 text-green-700'  :
                orden.estado === 'CANCELADA' ? 'bg-red-100 text-red-700'     :
                                           'bg-amber-100 text-amber-700'
              }`}>
                {orden.estado}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-100 text-amber-600 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Fecha de Creación</p>
              <p className="text-sm font-bold text-gray-800">{new Date(orden.fecha).toLocaleDateString('es')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Fecha de Entrega</p>
              <p className="text-sm font-bold text-gray-800">{orden.fechaEntrega ? new Date(orden.fechaEntrega).toLocaleDateString('es') : 'No especificada'}</p>
            </div>
          </div>

          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Productos de la Orden</h4>
          {orden.items && orden.items.length > 0 ? (
            <div className="space-y-2">
              <div className="flex px-4 py-2 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <span className="flex-1">Producto</span>
                <span className="w-20 text-center">Cant.</span>
                <span className="w-24 text-right">Precio Unit.</span>
                <span className="w-24 text-right">Subtotal</span>
              </div>
              {orden.items.map((it, idx) => (
                <div key={idx} className="flex px-4 py-3 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-600 items-center hover:border-gray-200 transition-colors">
                  <span className="flex-1 truncate">{it.producto?.nombre || 'Producto Desconocido'}</span>
                  <span className="w-20 text-center">{it.cantidad}</span>
                  <span className="w-24 text-right text-gray-500">${Number(it.precioUnit).toLocaleString('es', { minimumFractionDigits: 2 })}</span>
                  <span className="w-24 text-right font-black text-gray-800">${(it.cantidad * it.precioUnit).toLocaleString('es', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 font-bold px-4 py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">No hay detalles disponibles para esta orden.</p>
          )}

          {orden.notas && (
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Tag size={12}/> Notas</p>
              <p className="text-sm text-gray-700 font-medium">{orden.notas}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Inversión Total</p>
            <p className="text-2xl font-black text-gray-900">${orden.total.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Compras() {
  const [compras,       setCompras]       = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [showModal,     setShowModal]     = useState(false)
  const [selectedOrden, setSelectedOrden] = useState(null)
  const [busqueda,      setBusqueda]      = useState('')
  const [filtroEstado,  setFiltroEstado]  = useState('TODOS')

  async function marcarRecibida(id) {
    if (!window.confirm('¿Confirmas que recibiste esta orden? El stock de los productos se actualizará automáticamente.')) return
    try {
      await api.put(`/compras/${id}/recibir`)
      cargar()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al recibir orden')
    }
  }

  function cargar() {
    setLoading(true)
    api.get('/compras')
      .then(r => setCompras(r.data))
      .catch(() => setError('No se pudieron cargar las órdenes de compra'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const comprasFiltradas = compras.filter(c => {
    const coincideBusqueda = 
      String(c.id).includes(busqueda) || 
      c.proveedor?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    
    const coincideEstado = 
      filtroEstado === 'TODOS' || 
      c.estado === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">

      {showModal && <ModalNuevaOrden onClose={() => setShowModal(false)} onCreated={cargar} />}
      {selectedOrden && <ModalDetalleOrden orden={selectedOrden} onClose={() => setSelectedOrden(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <ShoppingBag className="text-amber-500" size={28} />
            Órdenes de Compra
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Abastecimiento y logística de entrada</p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={() => setShowModal(true)} icon={Plus}>
            Nueva Compra
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors pointer-events-none">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar por OC o Proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border-2 border-gray-50 focus:border-amber-400 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition-all shadow-sm hover:border-gray-100"
          />
        </div>
        <div className="md:col-span-4 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors pointer-events-none">
            <Filter size={18} />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full bg-white border-2 border-gray-50 focus:border-amber-400 rounded-2xl py-3.5 pl-12 pr-10 text-sm font-bold text-gray-700 outline-none transition-all shadow-sm hover:border-gray-100 appearance-none cursor-pointer"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="RECIBIDA">Recibidas</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-focus-within:text-amber-500 transition-colors">
            <ChevronDown size={18} />
          </div>
        </div>
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
          {comprasFiltradas.length === 0 ? (
            <p className="text-center text-gray-300 text-sm font-bold py-10">No se encontraron resultados para la búsqueda</p>
          ) : (
            comprasFiltradas.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:translate-x-2 transition-transform shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100">
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800">OC-{String(c.id).padStart(3, '0')}</h3>
                    <div className="flex flex-col mt-0.5">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Creada: {new Date(c.fecha).toLocaleDateString('es')}</p>
                      {c.fechaEntrega && (
                        <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">Entrega: {new Date(c.fechaEntrega).toLocaleDateString('es')}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 lg:px-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-bold mb-1">
                    <Truck size={16} className="text-amber-500" /> {c.proveedor?.nombre ?? '—'}
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
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest ${
                      c.estado === 'RECIBIDA'  ? 'bg-green-100 text-green-700'  :
                      c.estado === 'CANCELADA' ? 'bg-red-100 text-red-700'     :
                                                 'bg-amber-100 text-amber-700'
                    }`}>
                      {c.estado}
                    </div>
                    {c.estado === 'PENDIENTE' && (
                      <button 
                        onClick={() => marcarRecibida(c.id)}
                        className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Marcar Recibida
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedOrden(c)}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
