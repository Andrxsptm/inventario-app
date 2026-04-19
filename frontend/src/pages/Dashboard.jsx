import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid
} from 'recharts'
import {
  AlertTriangle, TrendingUp, User,
  ArrowUpRight, AlertCircle, Clock, Wallet, Box, Users, Truck, CheckCircle2, BarChart3
} from 'lucide-react'
import { FaDollarSign } from 'react-icons/fa'

/* ─── DATOS DE DEMO ─── */
const salesVsInvestment = [
  { name: 'Ene', ventas: 4000, compras: 2400 },
  { name: 'Feb', ventas: 3000, compras: 1398 },
  { name: 'Mar', ventas: 2000, compras: 9800 },
  { name: 'Abr', ventas: 2780, compras: 3908 },
  { name: 'May', ventas: 1890, compras: 4800 },
  { name: 'Jun', ventas: 2390, compras: 3800 },
]

const notifications = [
  { id: 1, type: 'critical', title: 'Stock Crítico', msg: 'Leche Deslactosada (2 uds)', time: '5m', icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600' },
  { id: 2, type: 'order', title: 'Pedido Nuevo', msg: 'Proveedor Global - Orden #502', time: '1h', icon: Truck, bg: 'bg-blue-50', text: 'text-blue-600' },
  { id: 3, type: 'info', title: 'Aviso Sistema', msg: 'Actualización de precios completada', time: '3h', icon: Clock, bg: 'bg-violet-50', text: 'text-violet-600' },
  { id: 4, type: 'critical', title: 'Stock Bajo', msg: 'Café Molido 250g (3 uds)', time: '5h', icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-600' },
]

const recentClients = [
  { id: 1, name: 'Marcos Mendoza', date: 'Hoy, 14:20' },
  { id: 2, name: 'Lucía Fernández', date: 'Hoy, 12:45' },
]

const topProducts = [
  { name: 'Café Premium', sales: 450, color: '#6366f1' },
  { name: 'Kit Limpieza', sales: 320, color: '#8b5cf6' },
  { name: 'Miel Abeja', sales: 300, color: '#a855f7' },
]

const lowStock = [
  { producto: 'Café Molido 250g', stock: 2, min: 10 },
  { producto: 'Leche Deslactosada', stock: 3, min: 15 },
]

/* Componentes de diseño */
function KpiCard({ icon: Icon, value, label, color }) {
  const styles = {
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' },
    red:   { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600' },
    blue:  { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' }
  }
  const s = styles[color] || styles.blue;
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

export default function Dashboard() {
  const navigate = useNavigate()
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">
      
      {/* Page Header (Minimal Style like Inventario) */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <BarChart3 className="text-blue-500" size={28} />
             Reporte General
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Resumen general de operaciones y rendimiento</p>
        </div>
      </div>
      
      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={FaDollarSign} value="$12,450" label="Ingresos Totales" color="green" />
        <KpiCard icon={Wallet} value="$8,200" label="Inversión" color="blue" />
        <KpiCard icon={TrendingUp} value="$4,250" label="Utilidad Est." color="green" />
        <KpiCard icon={AlertTriangle} value="3" label="Alertas" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Main Stats (Left) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black text-gray-700 uppercase leading-none">Balance General</h2>
              <div className="flex gap-4 text-[9px] font-black uppercase">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"/> Ventas</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-400"/> Compras</div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesVsInvestment}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="ventas" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="compras" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="card">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Top Productos</h2>
                <div className="space-y-4">
                   {topProducts.map((p, i) => (
                      <div key={i} className="flex flex-col gap-1">
                         <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-gray-600">{p.name}</span>
                            <span className="text-gray-800">{p.sales} u.</span>
                         </div>
                         <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(p.sales/500)*100}%` }} />
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="card">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Stock Crítico</h2>
                <div className="space-y-4">
                   {lowStock.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2 hover:bg-red-50 rounded-xl transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                               <AlertCircle size={14} />
                            </div>
                            <span className="text-xs font-bold text-gray-700">{s.producto}</span>
                         </div>
                         <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{s.stock} / {s.min}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card h-[180px] flex flex-col">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Últimos Clientes</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              {recentClients.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl group hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-800 leading-tight">{c.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card flex-1 flex flex-col min-h-[300px]">
             <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                <h2 className="text-xs font-black text-gray-700 uppercase tracking-widest">Avisos y Alertas</h2>
                <div className="w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center animate-pulse">
                   <AlertCircle size={12} />
                </div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 rounded-2xl border border-gray-50 ${n.bg} transition-all hover:scale-[1.02]`}>
                     <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm ${n.text}`}>
                           <n.icon size={14} />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <p className={`text-[10px] font-black uppercase tracking-tight ${n.text}`}>{n.title}</p>
                              <span className="text-[8px] font-bold text-gray-400">{n.time}</span>
                           </div>
                           <p className="text-[11px] font-bold text-gray-700 leading-snug mt-0.5">{n.msg}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             <p className="text-[10px] text-center text-gray-400 font-bold mt-4 uppercase tracking-tighter">
                Todas las alertas críticas están aquí
             </p>
          </div>
        </div>

      </div>
    </div>
  )
}
