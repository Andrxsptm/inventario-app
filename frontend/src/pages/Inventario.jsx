import { LayoutGrid, AlertTriangle, CheckCircle2, PackageSearch, ArrowUpRight, Package } from 'lucide-react'

const MOCK_INVENTARIO = [
  { id: 1, nombre: 'Café Premium Juan Valdez', stock: 24, min: 10, cat: 'Alimentos' },
  { id: 2, nombre: 'Azúcar Refinada 1kg', stock: 5, min: 20, cat: 'Alimentos' },
  { id: 3, nombre: 'Leche Enterprise 1L', stock: 45, min: 15, cat: 'Lácteos' },
  { id: 4, nombre: 'Aceite de Girasol 900ml', stock: 2, min: 10, cat: 'Aceites' },
]

export default function Inventario() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">
      <div className="flex justify-between items-center pt-2 lowercase">
        <div className="uppercase tracking-tighter">
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <Package className="text-blue-500" size={28} />
             Gestión de Inventario
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Estado logístico de tus productos en tiempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Items" val="145" icon={LayoutGrid} color="blue" />
        <StatCard label="Bajo Stock" val="8" icon={AlertTriangle} color="amber" />
        <StatCard label="Agotados" val="2" icon={AlertTriangle} color="red" />
        <StatCard label="Saludables" val="135" icon={CheckCircle2} color="green" />
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_INVENTARIO.map(p => (
           <div key={p.id} className="group relative bg-gray-50/50 p-5 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors shadow-sm">
                  <PackageSearch size={24} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  p.stock <= p.min ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {p.stock <= p.min ? 'Reabastecer' : 'Stock OK'}
                </div>
              </div>

              <h3 className="font-bold text-gray-800 line-clamp-1">{p.nombre}</h3>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">{p.cat}</p>

              <div className="mt-6 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Actual</p>
                  <p className={`text-2xl font-black ${p.stock <= p.min ? 'text-red-500' : 'text-gray-800'}`}>{p.stock}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Progreso</p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all ${p.stock <= p.min ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
           </div>
        ))}
        <div className="flex items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl p-10 cursor-pointer hover:bg-gray-50 transition-colors">
          <p className="text-gray-400 text-sm font-bold flex items-center gap-2">
            Ver Reporte Completo <ArrowUpRight size={18} />
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, val, icon: Icon, color }) {
  const c = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    red: 'text-red-600 bg-red-50 border-red-100',
    green: 'text-green-600 bg-green-50 border-green-100'
  }
  return (
    <div className={`p-4 rounded-2xl border bg-white flex items-center gap-4 shadow-sm`}>
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
