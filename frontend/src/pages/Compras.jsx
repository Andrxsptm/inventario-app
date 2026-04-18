import { ShoppingBag, Truck, Calendar, Tag, ChevronRight } from 'lucide-react'

const MOCK_COMPRAS = [
  { id: 'OC-990', fecha: '2024-04-10', proveedor: 'Distribuidora Global', total: 2400.00, items: 15, estado: 'RECIBIDA' },
  { id: 'OC-989', fecha: '2024-04-05', proveedor: 'Lácteos del Sur', total: 450.00, items: 8, estado: 'PENDIENTE' },
]

export default function Compras() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-gray-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
             <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <ShoppingBag size={24} />
             </div>
             Ordenes de Compra
          </h1>
          <p className="text-gray-400 text-sm mt-1">Abastecimiento y logística de entrada</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all relative z-10">
          + Generar Orden
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_COMPRAS.map(c => (
           <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:translate-x-2 transition-transform">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-50">
                    <ShoppingBag size={32} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-800">{c.id}</h3>
                    <p className="text-xs text-gray-400 uppercase font-black">{new Date(c.fecha).toLocaleDateString()}</p>
                 </div>
              </div>

              <div className="flex-1 lg:px-6">
                 <div className="flex items-center gap-2 text-sm text-gray-600 font-bold mb-1">
                    <Truck size={16} className="text-indigo-400" /> {c.proveedor}
                 </div>
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Tag size={14} /> {c.items} Productos en la orden
                 </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                 <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Inversión</p>
                    <p className="text-2xl font-black text-gray-900">${c.total.toLocaleString()}</p>
                 </div>
                 <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest ${
                   c.estado === 'RECIBIDA' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                 }`}>
                   {c.estado}
                 </div>
                 <button className="p-3 bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                    <ChevronRight size={20} />
                 </button>
              </div>
           </div>
        ))}
      </div>
    </div>
  )
}
