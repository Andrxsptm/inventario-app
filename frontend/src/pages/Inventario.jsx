import { useEffect, useState } from 'react'
import {
  LayoutGrid, AlertTriangle, CheckCircle2, PackageSearch,
  Package, Loader2, X, TrendingUp, BarChart2, ChevronRight
} from 'lucide-react'
import api from '../services/api'

/* ────────────────────────────────────────────────────── */
/* Modal: Reporte completo                               */
/* ────────────────────────────────────────────────────── */
function ModalReporteCompleto({ items, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
              <BarChart2 size={15} className="text-blue-500" /> Reporte Completo de Inventario
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {items.length} productos en total
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable product list */}
        <div className="overflow-y-auto custom-scrollbar flex-1 p-5">
          {items.length === 0 ? (
            <p className="text-center text-gray-300 text-sm font-bold py-10">
              No hay productos en inventario
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map(p => {
                const alertaOk = p.alerta === 'OK'
                const pct = Math.min(
                  (p.stockActual / Math.max(p.stockMinimo * 2, 1)) * 100,
                  100
                )
                return (
                  <div
                    key={p.id}
                    className="group bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors shadow-sm">
                        <PackageSearch size={20} />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        alertaOk ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {alertaOk ? 'OK' : p.alerta === 'AGOTADO' ? 'Agotado' : 'Bajo'}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{p.nombre}</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">
                      {p.proveedor?.nombre ?? 'Sin proveedor'}
                    </p>
                    <div className="mt-4 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Stock</p>
                        <p className={`text-xl font-black ${alertaOk ? 'text-gray-800' : 'text-red-500'}`}>
                          {p.stockActual}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Progreso</p>
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full transition-all ${alertaOk ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────── */
/* Main page                                             */
/* ────────────────────────────────────────────────────── */
export default function Inventario() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [showReport, setShowReport] = useState(false)

  // preview: first 6 items in grid, rest hidden until modal
  const PREVIEW_COUNT = 6

  useEffect(() => {
    api.get('/inventario')
      .then(r => setItems(r.data))
      .catch(() => setError('No se pudo cargar el inventario'))
      .finally(() => setLoading(false))
  }, [])

  const total      = items.length
  const agotados   = items.filter(p => p.alerta === 'AGOTADO').length
  const bajos      = items.filter(p => p.alerta === 'BAJO' || p.alerta === 'CRÍTICO').length
  const saludables = items.filter(p => p.alerta === 'OK').length

  // Top stock: sort descending by stockActual, take 8
  const topStock = [...items].sort((a, b) => b.stockActual - a.stockActual).slice(0, 8)
  const maxStock = topStock[0]?.stockActual || 1

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">

        {/* Header */}
        <div className="flex justify-between items-center pt-2 lowercase">
          <div className="uppercase tracking-tighter">
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
              <Package className="text-blue-500" size={28} />
              Gestión de Inventario
            </h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
              Estado logístico de tus productos en tiempo real
            </p>
          </div>
          {loading && <Loader2 size={20} className="text-blue-400 animate-spin" />}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Items"  val={total}      icon={LayoutGrid}    color="blue"  />
          <StatCard label="Bajo Stock"   val={bajos}      icon={AlertTriangle} color="amber" />
          <StatCard label="Agotados"     val={agotados}   icon={AlertTriangle} color="red"   />
          <StatCard label="Saludables"   val={saludables} icon={CheckCircle2}  color="green" />
        </div>

        {/* Main area: grid + right panel */}
        <div className="flex gap-6 items-start">

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="card grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-50 rounded-3xl h-44" />
                ))
              ) : items.length === 0 ? (
                <p className="col-span-3 text-center text-gray-300 text-sm font-bold py-10">
                  No hay productos en inventario
                </p>
              ) : (
                items.slice(0, PREVIEW_COUNT).map(p => {
                  const alertaOk = p.alerta === 'OK'
                  return (
                    <div key={p.id} className="group relative bg-gray-50/50 p-5 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors shadow-sm">
                          <PackageSearch size={24} />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          alertaOk ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {alertaOk ? 'Stock OK' : p.alerta === 'AGOTADO' ? 'Agotado' : 'Reabastecer'}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 line-clamp-1">{p.nombre}</h3>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
                        {p.proveedor?.nombre ?? 'Sin proveedor'}
                      </p>
                      <div className="mt-6 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Actual</p>
                          <p className={`text-2xl font-black ${alertaOk ? 'text-gray-800' : 'text-red-500'}`}>
                            {p.stockActual}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Progreso</p>
                          <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full transition-all ${alertaOk ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min((p.stockActual / Math.max(p.stockMinimo * 2, 1)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}

              {/* Ver Reporte Completo */}
              {!loading && items.length > 0 && (
                <button
                  onClick={() => setShowReport(true)}
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-100 rounded-3xl p-10 cursor-pointer hover:bg-violet-50 hover:border-violet-200 transition-all group"
                >
                  <div className="w-10 h-10 bg-gray-50 group-hover:bg-violet-100 rounded-2xl flex items-center justify-center transition-colors">
                    <BarChart2 size={18} className="text-gray-400 group-hover:text-violet-600 transition-colors" />
                  </div>
                  <p className="text-gray-400 group-hover:text-violet-600 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-1.5">
                    Ver todos ({items.length})
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Right panel: Top Stock */}
          <div className="hidden xl:block w-64 shrink-0">
            <div className="card space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-blue-500" />
                <h2 className="text-xs font-black text-gray-700 uppercase tracking-widest">
                  Más Existencias
                </h2>
              </div>

              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-50 rounded-xl h-10" />
                ))
              ) : topStock.length === 0 ? (
                <p className="text-[10px] text-gray-300 font-bold text-center py-4 uppercase tracking-tighter">
                  Sin datos
                </p>
              ) : (
                topStock.map((p, i) => {
                  const pct = Math.round((p.stockActual / maxStock) * 100)
                  const alertaOk = p.alerta === 'OK'
                  return (
                    <div key={p.id} className="group py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[9px] font-black text-gray-300 w-3 shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-[11px] font-bold text-gray-700 truncate">
                            {p.nombre}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-gray-500 ml-2 shrink-0">
                          {p.stockActual}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden ml-5">
                        <div
                          className={`h-full rounded-full transition-all ${alertaOk ? 'bg-blue-400' : 'bg-amber-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              )}

              {!loading && items.length > 0 && (
                <button
                  onClick={() => setShowReport(true)}
                  className="w-full mt-3 py-2 text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
                >
                  Ver todos →
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modal reporte completo */}
      {showReport && (
        <ModalReporteCompleto items={items} onClose={() => setShowReport(false)} />
      )}
    </>
  )
}

function StatCard({ label, val, icon: Icon, color }) {
  const c = {
    blue:  'text-blue-600 bg-blue-50 border-blue-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    red:   'text-red-600 bg-red-50 border-red-100',
    green: 'text-green-600 bg-green-50 border-green-100'
  }
  return (
    <div className="p-4 rounded-2xl border bg-white flex items-center gap-4 shadow-sm">
      <div className={`w-10 h-10 ${c[color]} rounded-xl flex items-center justify-center`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-lg font-black text-gray-800 leading-none">{val}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  )
}
