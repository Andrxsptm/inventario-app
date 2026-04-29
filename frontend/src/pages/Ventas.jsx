import { useEffect, useState } from 'react'
import { ShoppingCart, Clock, User, ArrowUpRight, DollarSign, Package, Users, Tag, Calendar, Loader2, Search, FileText, X } from 'lucide-react'
import Button from '../components/common/Button'
import api from '../services/api'

function ModalDetalleVenta({ venta, onClose }) {
  if (!venta) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-modal-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-orange-50 border-b border-orange-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <ShoppingCart className="text-orange-500" size={20} />
              Detalle de Venta V-{venta.id}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {new Date(venta.fecha).toLocaleString('es')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-orange-100 text-orange-600 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Cliente & Info */}
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

          {/* Productos */}
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
          
          {venta.notas && (
             <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Notas</h3>
                <p className="text-xs font-bold text-gray-600 bg-orange-50/50 p-3 rounded-xl">{venta.notas}</p>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total de la Venta</p>
            <p className="text-2xl font-black text-gray-900">${venta.total.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
          </div>
          <button className="py-2.5 px-5 text-xs font-black uppercase tracking-widest text-white bg-orange-500 hover:bg-orange-600 rounded-2xl flex items-center gap-2 transition-all active:scale-[0.98]">
            <FileText size={16} />
            Ver Factura
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Ventas() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)

  useEffect(() => {
    api.get('/ventas')
      .then(r => setVentas(r.data))
      .catch(() => setError('No se pudieron cargar las ventas'))
      .finally(() => setLoading(false))
  }, [])

  // Calcular KPIs del día
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const ventasHoy = ventas.filter(v => new Date(v.fecha) >= hoy && v.estado === 'COMPLETADA')
  const totalHoy  = ventasHoy.reduce((acc, v) => acc + v.total, 0)
  const unidadesHoy = ventasHoy.reduce((acc, v) => acc + (v.items?.reduce((s, i) => s + i.cantidad, 0) ?? 0), 0)
  const clientesHoy = new Set(ventasHoy.filter(v => v.clienteId).map(v => v.clienteId)).size

  const ventasFiltradas = ventas.filter(v => {
    if (!busqueda) return true
    const iden = v.cliente?.identificacion?.toLowerCase() || ''
    const nom = v.cliente?.nombre?.toLowerCase() || ''
    const s = busqueda.toLowerCase()
    return iden.includes(s) || nom.includes(s)
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">
      
      <ModalDetalleVenta venta={ventaSeleccionada} onClose={() => setVentaSeleccionada(null)} />
      
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <ShoppingCart className="text-orange-500" size={28} />
             Flujo de Ventas
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Control de transacciones y facturación</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <DollarSign size={24} />
           </div>
           <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Ventas de Hoy</p>
              <p className="text-2xl font-black text-gray-800">${totalHoy.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Package size={24} />
           </div>
           <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Productos Salientes</p>
              <p className="text-2xl font-black text-gray-800">{unidadesHoy} uds.</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <Users size={24} />
           </div>
           <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Clientes Atendidos</p>
              <p className="text-2xl font-black text-gray-800">{clientesHoy} Hoy</p>
           </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="card px-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
           <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest shrink-0">Historial Reciente</h2>
           <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 group">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                    <Search size={16} />
                 </div>
                 <input 
                    type="text"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar por cédula o nombre..."
                    className="w-full bg-white border-2 border-gray-100 focus:border-orange-400 focus:bg-white rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-gray-700 outline-none transition-all"
                 />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 bg-white border-2 border-gray-100 rounded-xl transition-colors"><Calendar size={18}/></button>
           </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-xs font-bold uppercase">Cargando ventas...</span>
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
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-300 text-xs font-bold uppercase">
                      {busqueda ? 'No se encontraron resultados' : 'No hay ventas registradas'}
                    </td>
                  </tr>
                ) : (
                  ventasFiltradas.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-700">V-{v.id}</p>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                           <Clock size={10} /> {new Date(v.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-[10px] font-black">
                              {(v.cliente?.nombre ?? 'C').charAt(0)}
                           </div>
                           <div>
                              <p className="text-[11px] font-bold text-gray-800">{v.cliente?.nombre ?? 'Consumidor Final'}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                                 <User size={10} className="text-orange-400" /> {v.usuario?.nombre ?? '—'}
                              </p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                           <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-lg">
                              {v.items?.length ?? 0} Items
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-800">${v.total.toLocaleString('es', { minimumFractionDigits: 2 })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          v.estado === 'COMPLETADA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${v.estado === 'COMPLETADA' ? 'bg-green-500' : 'bg-red-500'}`} />
                          {v.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setVentaSeleccionada(v)} className="p-2 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                           <ArrowUpRight size={18} />
                        </button>
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
