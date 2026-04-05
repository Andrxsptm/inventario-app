import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  AlertTriangle, TrendingUp, User,
  ArrowUpRight, AlertCircle, Clock,
} from 'lucide-react'
import { FaDollarSign } from 'react-icons/fa'

/* ─── Mock data (replace with API calls) ─── */
const salesWeek = [
  { day: 'Lunes',     ventas: 1800 },
  { day: 'Martes',    ventas: 3200 },
  { day: 'Miércoles', ventas: 2100 },
  { day: 'Jueves',    ventas: 3800 },
  { day: 'Viernes',   ventas: 2900 },
]

const recentSales = [
  { id: 1, producto: 'Máquina de café',  estado: 'pendiente' },
  { id: 2, producto: 'Tostadora',        estado: 'pendiente' },
  { id: 3, producto: 'Silla ergonómica', estado: 'pendiente' },
]

const recentClients = [
  { id: 1, name: 'Pedro López',    date: '24 abr 2024' },
  { id: 2, name: 'Juana García',   date: '24 abr 2024' },
  { id: 3, name: 'Luis Martínez',  date: '23 abr 2024' },
]

const alerts = [
  { id: 1, msg: 'La Mantequilla se está agotando.' },
  { id: 2, msg: 'El café se está agotando.' },
]

const lowStock = [
  { producto: 'Huevos',      cantidad: 5, precio: 5.00 },
  { producto: 'Chicharrón',  cantidad: 2, precio: 1.00 },
  { producto: 'Nose',        cantidad: 1, precio: 1.00 },
]

/* subcomponente: Cards */
function KpiCard({ icon: Icon, value, label, color }) {
  const theme = {
    green: { border: 'border-green-500', iconBg: 'bg-green-50', iconText: 'text-green-600' },
    red:   { border: 'border-red-500', iconBg: 'bg-red-50', iconText: 'text-red-600' }
  }

  const active = theme[color] || theme.green; // green por defecto

  return (
    <div className={`bg-white border-2 ${active.border} rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm`}>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${active.iconBg} ${active.iconText} rounded-full flex items-center justify-center shrink-0`}>
        <Icon className="text-xl sm:text-2xl" />
      </div>
      <div className="min-w-0">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">{value}</p>
        <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
      </div>
    </div>
  )
}
function SectionTitle({ children }) {
  return <h2 className="text-sm font-semibold text-gray-700 mb-3">{children}</h2>
}

const BAR_COLORS = ['#3b82f6', '#60a5fa', '#2563eb', '#1d4ed8', '#93c5fd']

/* ─── Main Dashboard ─── */
export default function Dashboard() {
  return (
    <div className="space-y-5">

      {/* ── Row 1: KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          icon={FaDollarSign}
          value="2,500"
          label="Ventas hoy"
          border="black"
          color="green"
        />
        <KpiCard
          icon={AlertTriangle}
          value="6"
          label="Productos con stock bajo"
          color="red"
        />
        {/* Empty slot for a future KPI or summary */}
        <div className="card flex flex-col justify-between">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Últimos clientes</p>
          <ul className="mt-2 divide-y divide-gray-50">
            {recentClients.map((c) => (
              <li key={c.id} className="flex items-center gap-2 py-1.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User size={14} className="text-gray-500" />
                </div>
                <span className="text-sm text-gray-700 flex-1 truncate">{c.name}</span>
                <span className="text-xs text-gray-400">{c.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Row 2: Sales list + Chart + Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Últimas ventas */}
        <div className="card">
          <SectionTitle>Últimas ventas</SectionTitle>
          <ul className="space-y-3">
            {recentSales.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                  <Clock size={10} className="text-white" />
                </span>
                <span className="text-sm text-gray-700 flex-1">{s.producto}</span>
                <div className="w-8 h-8 bg-amber-200 rounded" />
              </li>
            ))}
          </ul>
        </div>

        {/* Ventas 7 días */}
        <div className="card">
          <SectionTitle>Ventas en los últimos 7 días</SectionTitle>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={salesWeek} barSize={28}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'rgba(59,130,246,0.08)' }}
                contentStyle={{
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: 12,
                }}
                formatter={(v) => [`$${v.toLocaleString()}`, 'Ventas']}
              />
              <Bar dataKey="ventas" radius={[6, 6, 0, 0]}>
                {salesWeek.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alertas */}
        <div className="card">
          <SectionTitle>Alertas</SectionTitle>
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li key={a.id} className="flex items-start gap-2.5">
                <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-600">{a.msg}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <button className="text-xs text-accent hover:underline font-medium">
              Ver todas las alertas →
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 3: Low-stock table ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle>Productos por Agotarse</SectionTitle>
          <button className="btn-ghost flex items-center gap-1 text-xs">
            Ver inventario <ArrowUpRight size={13} />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 font-medium uppercase tracking-wide border-b border-gray-100">
              <th className="pb-2 text-left">Producto</th>
              <th className="pb-2 text-center">Cantidad</th>
              <th className="pb-2 text-center">Estado</th>
              <th className="pb-2 text-right">Precio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lowStock.map((row) => {
              const badge =
                row.cantidad === 0 ? 'badge-agotado' :
                row.cantidad <= 2  ? 'badge-critico' :
                row.cantidad <= 5  ? 'badge-bajo'    : 'badge-ok'
              const label =
                row.cantidad === 0 ? 'AGOTADO' :
                row.cantidad <= 2  ? 'CRÍTICO' :
                row.cantidad <= 5  ? 'BAJO'    : 'OK'
              return (
                <tr key={row.producto} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-medium text-gray-700">{row.producto}</td>
                  <td className="py-3 text-center">
                    <span className="flex items-center justify-center gap-1 text-orange-500 font-semibold">
                      <TrendingUp size={13} /> {row.cantidad}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={badge}>{label}</span>
                  </td>
                  <td className="py-3 text-right font-semibold text-orange-500">
                    ${row.precio.toFixed(2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
