import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts'
import {
  AlertTriangle, TrendingUp, User,
  ArrowUpRight, AlertCircle, Clock, Wallet
} from 'lucide-react'
import { FaDollarSign } from 'react-icons/fa'

/* ─── DATOS DE DEMO (Estáticos) ─── */
const salesWeek = [
  { day: 'Lun', ventas: 1200 },
  { day: 'Mar', ventas: 2100 },
  { day: 'Mié', ventas: 1800 },
  { day: 'Jue', ventas: 3400 },
  { day: 'Vie', ventas: 2800 },
  { day: 'Sáb', ventas: 4200 },
  { day: 'Dom', ventas: 3100 },
]

const recentSales = [
  { id: 1, p: 'Café Premium 500g', total: 45.00,  h: 'Hace 5 min' },
  { id: 2, p: 'Kit de Limpieza Pro', total: 120.50, h: 'Hace 12 min' },
  { id: 3, p: 'Mantequilla Artesanal', total: 12.00,  h: 'Hace 1 hora' },
  { id: 4, p: 'Caja Termoeléctrica', total: 850.00, h: 'Hace 2 horas' },
]

const recentClients = [
  { id: 1, name: 'Marcos Mendoza', date: 'Hoy, 14:20' },
  { id: 2, name: 'Lucía Fernández', date: 'Hoy, 12:45' },
  { id: 3, name: 'Roberto J. Pino', date: 'Ayer, 18:30' },
]

const alerts = [
  { id: 1, msg: 'Existencias críticas: Café Molido (2 uds)', type: 'critical' },
  { id: 2, msg: 'Pedido #452 pendiente de recepción', type: 'info' },
  { id: 3, msg: 'Stock bajo: Azúcar Refinada 1kg', type: 'warning' },
]

const lowStock = [
  { producto: 'Café Molido 250g', stock: 2, min: 10, precio: 8.50 },
  { producto: 'Leche Deslactosada', stock: 3, min: 15, precio: 2.20 },
  { producto: 'Miel de Abeja 1L',  stock: 1, min: 5,  precio: 15.00 },
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
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard icon={FaDollarSign} value="$12,450" label="Ventas Mensuales" color="green" />
        <KpiCard icon={AlertTriangle} value="3" label="Alertas de Stock" color="red" />
        <KpiCard icon={Wallet} value="$4,200" label="Inversión Pendiente" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico principal */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black text-gray-700 uppercase">Flujo de Ventas (7 días)</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesWeek}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimos Clientes */}
        <div className="card">
          <h2 className="text-sm font-black text-gray-700 uppercase mb-4">Nuevos Clientes</h2>
          <div className="space-y-4">
            {recentClients.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{c.name}</p>
                  <p className="text-[10px] text-gray-400">{c.date}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs font-bold text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            Ver Todos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de Stock */}
        <div className="card overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black text-gray-700 uppercase">Agotándose Pronto</h2>
            <ArrowUpRight className="text-gray-300" size={18} />
          </div>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="pb-2">Producto</th>
                <th className="pb-2 text-center">En Mano</th>
                <th className="pb-2 text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((s, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-bold text-gray-700">{s.producto}</td>
                  <td className="py-3 text-center">{s.stock} / {s.min}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      s.stock < s.min/2 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {s.stock < s.min/2 ? 'CRÍTICO' : 'BAJO'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notificaciones de Sistema */}
        <div className="card">
          <h2 className="text-sm font-black text-gray-700 uppercase mb-4">Avisos del Sistema</h2>
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <AlertCircle size={16} className={a.type === 'critical' ? 'text-red-500' : 'text-blue-500'} />
                <p className="text-xs text-gray-600">{a.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
