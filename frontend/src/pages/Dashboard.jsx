import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import {
  AlertTriangle, TrendingUp,
  AlertCircle, Clock, Wallet, Truck, BarChart3, Loader2, Users
} from 'lucide-react'
import { FaDollarSign } from 'react-icons/fa'
import api from '../services/api'

/* Componentes de diseño */
function TarjetaKpi({ icon: Icon, value, label, color }) {
  const styles = {
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' },
    red:   { border: 'border-red-500',   bg: 'bg-red-50',   text: 'text-red-600' },
    blue:  { border: 'border-blue-500',  bg: 'bg-blue-50',  text: 'text-blue-600' }
  }
  const s = styles[color] || styles.blue
  return (
    <div className={`bg-white border-b-4 ${s.border} rounded-xl p-5 shadow-sm transition-transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xl lg:text-3xl font-black text-gray-800">{value}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{label}</p>
        </div>
        <div className={`w-10 h-10 ${s.bg} ${s.text} rounded-lg flex items-center justify-center`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

function Esqueleto({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/reportes/dashboard')
      .then(r => setData(r.data))
      .catch(() => setError('No se pudo cargar el dashboard'))
      .finally(() => setLoading(false))
  }, [])

  /* ── Derivar datos del API ── */
  const ventasHoy     = data?.ventasHoy   ?? 0
  const stockBajo     = data?.stockBajo   ?? 0
  const ultimosClientes = data?.ultimosClientes ?? []
  const productosAgotarse = data?.productosAgotarse ?? []

  // Gráfico: top productos de las últimas ventas
  const topProductos = (() => {
    if (!data?.ultimasVentas) return []
    const map = {}
    data.ultimasVentas.forEach(v =>
      v.items?.forEach(i => {
        const nombre = i.producto?.nombre ?? 'Desconocido'
        map[nombre] = (map[nombre] ?? 0) + i.cantidad
      })
    )
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, sales], idx) => ({
        name: name.length > 12 ? name.slice(0, 12) + '…' : name,
        sales,
        color: ['#6366f1','#8b5cf6','#a855f7','#3b82f6','#06b6d4'][idx]
      }))
  })()

  // Gráfico de barras: ventas por fecha (últimas 6 ventas agrupadas por día)
  const salesChart = (() => {
    if (!data?.ultimasVentas) return []
    const map = {}
    data.ultimasVentas.forEach(v => {
      const d = new Date(v.fecha).toLocaleDateString('es', { day: '2-digit', month: 'short' })
      map[d] = (map[d] ?? 0) + v.total
    })
    return Object.entries(map).slice(-6).map(([name, ventas]) => ({ name, ventas }))
  })()

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <BarChart3 className="text-blue-500" size={28} />
             Reporte General
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Resumen general de operaciones y ventas</p>
        </div>
        {loading && <Loader2 size={20} className="text-blue-400 animate-spin" />}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Esqueleto key={i} className="h-24" />)
        ) : (
          <>
            <TarjetaKpi icon={FaDollarSign} value={`$${ventasHoy.toLocaleString('es', { minimumFractionDigits: 2 })}`} label="Ventas de Hoy" color="green" />
            <TarjetaKpi icon={Wallet}       value={`${stockBajo}`}   label="Productos Bajo Stock" color="blue" />
            <TarjetaKpi icon={TrendingUp}   value={`${ultimosClientes.length}`} label="Clientes Recientes" color="green" />
            <TarjetaKpi icon={AlertTriangle} value={`${productosAgotarse.filter(p => p.stockActual === 0).length}`} label="Agotados" color="red" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Main Stats (Left) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black text-gray-700 uppercase leading-none">Ventas Recientes</h2>
              <div className="flex gap-4 text-[9px] font-black uppercase">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"/> Ingresos</div>
              </div>
            </div>
            <div className="h-64">
              {loading ? (
                <Esqueleto className="h-full" />
              ) : salesChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesChart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <Tooltip
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300 text-xs font-bold uppercase">Sin ventas registradas aún</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="card">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Top Productos Vendidos</h2>
                {loading ? (
                  <div className="space-y-4">{Array(3).fill(0).map((_, i) => <Esqueleto key={i} className="h-8" />)}</div>
                ) : topProductos.length > 0 ? (
                  <div className="space-y-4 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                    {topProductos.map((p, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex justify-between text-[11px] font-bold">
                           <span className="text-gray-600">{p.name}</span>
                           <span className="text-gray-800">{p.sales} u.</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                           <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(p.sales / (topProductos[0]?.sales || 1)) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-300 font-bold text-center py-4">Sin datos de ventas</p>
                )}
             </div>

             <div className="card">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Productos en stock crítico</h2>
                {loading ? (
                  <div className="space-y-4">{Array(3).fill(0).map((_, i) => <Esqueleto key={i} className="h-10" />)}</div>
                ) : productosAgotarse.length > 0 ? (
                  <div className="space-y-4 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                    {productosAgotarse.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-red-50 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                            <AlertCircle size={14} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 line-clamp-1">{p.nombre}</span>
                        </div>
                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{p.stockActual} / {p.stockMinimo}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-green-500 font-bold text-center py-4">✓ Todo el stock está saludable</p>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card h-[180px] flex flex-col">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Últimos Clientes</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              {loading ? (
                Array(2).fill(0).map((_, i) => <Esqueleto key={i} className="h-10" />)
              ) : ultimosClientes.length > 0 ? (
                ultimosClientes.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl group hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {c.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-800 leading-tight">{c.nombre}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                        {new Date(c.createdAt).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-300 font-bold text-center py-4">Sin clientes aún</p>
              )}
            </div>
          </div>

          <div className="card flex-1 flex flex-col min-h-[300px]">
             <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                <h2 className="text-xs font-black text-gray-700 uppercase tracking-widest">Alertas de Stock</h2>
                <div className="w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center animate-pulse">
                   <AlertCircle size={12} />
                </div>
             </div>
             <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 space-y-3">
               {loading ? (
                 Array(3).fill(0).map((_, i) => <Esqueleto key={i} className="h-16" />)
               ) : productosAgotarse.length > 0 ? (
                productosAgotarse.map((p, i) => {
                  const agotado = p.stockActual === 0
                  return (
                    <div key={i} className={`p-3 rounded-2xl border border-gray-50 ${agotado ? 'bg-red-50' : 'bg-amber-50'} transition-all hover:scale-[1.02]`}>
                       <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm ${agotado ? 'text-red-600' : 'text-amber-600'}`}>
                             <AlertTriangle size={14} />
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-start">
                                <p className={`text-[10px] font-black uppercase tracking-tight ${agotado ? 'text-red-600' : 'text-amber-600'}`}>
                                  {agotado ? 'Agotado' : 'Stock Bajo'}
                                </p>
                                <span className="text-[8px] font-bold text-gray-400">{p.stockActual} uds</span>
                             </div>
                             <p className="text-[11px] font-bold text-gray-700 leading-snug mt-0.5 line-clamp-1">{p.nombre}</p>
                          </div>
                       </div>
                    </div>
                  )
                })
               ) : (
                 <p className="text-[10px] text-center text-green-500 font-bold mt-4 uppercase tracking-tighter">
                   Sin alertas críticas
                 </p>
               )}
             </div>
             <p className="text-[10px] text-center text-gray-400 font-bold mt-4 uppercase tracking-tighter">
                Todas las alertas de stock están aquí
             </p>
          </div>
        </div>

      </div>
    </div>
  )
}
