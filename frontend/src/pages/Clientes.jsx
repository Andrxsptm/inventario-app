import { useEffect, useState } from 'react'
import { Users, Phone, MapPin, Search, Loader2, TrendingUp, Star } from 'lucide-react'
import api from '../services/api'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    api.get('/clientes')
      .then(r => setClientes(r.data))
      .catch(() => setError('No se pudieron cargar los clientes'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.correo ?? '').toLowerCase().includes(search.toLowerCase())
  )

  /* Top 5 por totalCompras */
  const topClientes = [...clientes]
    .sort((a, b) => (b.totalCompras ?? 0) - (a.totalCompras ?? 0))
    .slice(0, 5)

  const maxCompras = topClientes[0]?.totalCompras || 1

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">

      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <Users className="text-indigo-500" size={28} />
            Clientes
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
            Clientes registrados
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Search */}
      <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
        <Search size={20} className="text-gray-300" />
        <input
          type="text"
          placeholder="Buscar cliente por nombre o identificación..."
          className="bg-transparent border-none outline-none text-sm w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Main layout: grid + right panel */}
      <div className="flex gap-6 items-start">

        {/* Client cards */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs font-bold uppercase">Cargando clientes</span>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-300 text-sm font-bold py-10">
              {clientes.length === 0 ? 'No hay clientes registrados' : 'Sin resultados para tu búsqueda'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all group flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black mb-4 shadow-xl shadow-indigo-100 transform group-hover:rotate-12 transition-transform">
                    {c.nombre.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{c.nombre}</h3>
                  <p className="text-xs text-gray-400 mb-6">{c.correo ?? '—'}</p>
                  <div className="w-full space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 justify-center">
                      <Phone size={12} className="text-indigo-400" /> {c.telefono ?? '—'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 justify-center">
                      <MapPin size={12} className="text-indigo-400" /> {c.direccion ?? 'Sin dirección'}
                    </div>
                  </div>
                  <div className="w-full pt-4 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Gasto Total</p>
                    <p className="text-xl font-black text-indigo-600">${(c.totalCompras ?? 0).toLocaleString('es', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel: Clientes frecuentes */}
        {!loading && clientes.length > 0 && (
          <div className="hidden xl:block w-64 shrink-0">
            <div className="card space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <Star size={14} className="text-indigo-500" />
                <h2 className="text-xs font-black text-gray-700 uppercase tracking-widest">
                  Clientes Frecuentes
                </h2>
              </div>

              {topClientes.map((c, i) => {
                const pct = maxCompras > 0 ? Math.round((c.totalCompras / maxCompras) * 100) : 0
                return (
                  <div key={c.id} className="group py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-black text-gray-300 w-3 shrink-0">{i + 1}</span>
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                        {c.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-700 truncate">{c.nombre}</p>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 ml-1 shrink-0">
                        ${(c.totalCompras ?? 0) > 999
                          ? `${((c.totalCompras ?? 0) / 1000).toFixed(1)}k`
                          : (c.totalCompras ?? 0).toFixed(0)}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden ml-5">
                      <div
                        className="h-full rounded-full bg-indigo-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}

              <div className="pt-3 mt-1 border-t border-gray-50">
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center">
                  Por volumen de compras
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
