import { useEffect, useState } from 'react'
import {
  LayoutGrid, AlertTriangle, CheckCircle2, PackageSearch,
  Package, Loader2, TrendingUp
} from 'lucide-react'
import api from '../services/api'

/* ────────────────────────────────────────────────────── */
/* Tarjeta de estadística                                */
/* ────────────────────────────────────────────────────── */
function TarjetaEstadistica({ label, val, icon: Icono, color }) {
  const colores = {
    blue:  'text-blue-600 bg-blue-50 border-blue-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    red:   'text-red-600 bg-red-50 border-red-100',
    green: 'text-green-600 bg-green-50 border-green-100',
  }
  return (
    <div className="p-4 rounded-2xl border bg-white flex items-center gap-4 shadow-sm">
      <div className={`w-10 h-10 ${colores[color]} rounded-xl flex items-center justify-center`}>
        <Icono size={20} />
      </div>
      <div>
        <p className="text-lg font-black text-gray-800 leading-none">{val}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────── */
/* Tarjeta de producto individual                        */
/* ────────────────────────────────────────────────────── */
function TarjetaProducto({ producto: p }) {
  const alertaOk = p.alerta === 'OK'
  const porcentaje = Math.min((p.stockActual / Math.max(p.stockMinimo * 2, 1)) * 100, 100)

  return (
    <div className="group relative bg-gray-50/50 p-5 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all">
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
          <p className="text-[10px] text-gray-400 uppercase font-bold">Cantidad</p>
          <p className={`text-2xl font-black ${alertaOk ? 'text-gray-800' : 'text-red-500'}`}>
            {p.stockActual}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase font-bold">Nivel de alerta</p>
          <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full transition-all ${alertaOk ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────── */
/* Página principal                                      */
/* ────────────────────────────────────────────────────── */
export default function Inventario() {
  const [productos,  setProductos]  = useState([])
  const [cargando,   setCargando]   = useState(true)
  const [error,      setError]      = useState(null)
  const [expandido,  setExpandido]  = useState(false)

  const LIMITE_VISTA = 6

  useEffect(() => {
    api.get('/inventario')
      .then(r => setProductos(r.data))
      .catch(() => setError('No se pudo cargar el inventario'))
      .finally(() => setCargando(false))
  }, [])

  const total    = productos.length
  const agotados = productos.filter(p => p.alerta === 'AGOTADO').length
  const bajos    = productos.filter(p => p.alerta === 'BAJO' || p.alerta === 'CRÍTICO').length
  const altos    = productos.filter(p => p.alerta === 'OK').length

  const topStock  = [...productos].sort((a, b) => b.stockActual - a.stockActual).slice(0, 8)
  const maxStock  = topStock[0]?.stockActual || 1

  const productosVisibles = expandido ? productos : productos.slice(0, LIMITE_VISTA)
  const hayMas = !cargando && productos.length > LIMITE_VISTA

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">

      {/* Cabecera */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <Package className="text-blue-500" size={28} />
            Gestión de Inventario
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
            Estado logístico de productos
          </p>
        </div>
        {cargando && <Loader2 size={20} className="text-blue-400 animate-spin" />}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TarjetaEstadistica label="Total productos" val={total}    icon={LayoutGrid}    color="blue"  />
        <TarjetaEstadistica label="Stock Bajo"      val={bajos}    icon={AlertTriangle} color="amber" />
        <TarjetaEstadistica label="Agotados"        val={agotados} icon={AlertTriangle} color="red"   />
        <TarjetaEstadistica label="Stock Alto"      val={altos}    icon={CheckCircle2}  color="green" />
      </div>

      {/* Área principal: grid + panel derecho */}
      <div className="flex gap-6 items-start">

        {/* Grid de productos */}
        <div className="flex-1 min-w-0">
          <div
            className={`card grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[460px] ${
              expandido ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'
            }`}
          >
            {cargando ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-50 rounded-3xl h-44" />
              ))
            ) : productos.length === 0 ? (
              <p className="col-span-3 text-center text-gray-300 text-sm font-bold py-10">
                No hay productos en inventario
              </p>
            ) : (
              productos.map(p => (
                <TarjetaProducto key={p.id} producto={p} />
              ))
            )}
          </div>

          {/* Botón Ver todos — aparece solo si hay más de 6 */}
          {hayMas && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setExpandido(v => !v)}
                className="flex items-center gap-2 px-8 py-3 bg-violet-50 hover:bg-violet-100 text-violet-600 font-black text-[11px] uppercase tracking-widest rounded-full transition-all active:scale-[0.97] shadow-sm"
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

        {/* Panel derecho: Top Stock */}
        <div className="hidden xl:block w-64 shrink-0">
          <div className="card space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-blue-500" />
              <h2 className="text-xs font-black text-gray-700 uppercase tracking-widest">
                Productos con más existencias
              </h2>
            </div>

            {cargando ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-50 rounded-xl h-10" />
              ))
            ) : topStock.length === 0 ? (
              <p className="text-[10px] text-gray-300 font-bold text-center py-4 uppercase tracking-tighter">
                Sin datos
              </p>
            ) : (
              topStock.map((p, i) => {
                const pct      = Math.round((p.stockActual / maxStock) * 100)
                const alertaOk = p.alerta === 'OK'
                return (
                  <div key={p.id} className="group py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[9px] font-black text-gray-300 w-3 shrink-0">{i + 1}</span>
                        <span className="text-[11px] font-bold text-gray-700 truncate">{p.nombre}</span>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 ml-2 shrink-0">{p.stockActual}</span>
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

            {!cargando && productos.length > 0 && (
              <button
                onClick={() => setExpandido(v => !v)}
                className="w-full mt-3 py-2 text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
              >
                {expandido ? 'Ver menos' : 'Ver todos →'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
