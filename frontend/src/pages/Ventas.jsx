import { ShoppingCart, Clock, User, ArrowUpRight, CheckCircle2 } from 'lucide-react'

const MOCK_VENTAS = [
  { id: 'V-0024', fecha: 'Hoy, 14:10', cliente: 'Andrxs Ptm', total: 450.00, estado: 'COMPLETADA' },
  { id: 'V-0023', fecha: 'Hoy, 12:30', cliente: 'Camila Rosales', total: 120.50, estado: 'COMPLETADA' },
  { id: 'V-0022', fecha: 'Ayer, 09:15', cliente: 'Consumidor Final', total: 45.00, estado: 'CANCELADA' },
]

export default function Ventas() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            Gestión de Ventas
          </h1>
          <p className="text-sm text-gray-400 mt-1">Historial y creación de órdenes de salida</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-100">
          + Nueva Venta
        </button>
      </div>

      <div className="card space-y-4">
        {MOCK_VENTAS.map(v => (
          <div key={v.id} className="p-5 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                 v.estado === 'COMPLETADA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
               }`}>
                 <Clock size={24} />
               </div>
               <div>
                 <h3 className="font-black text-gray-800">{v.id}</h3>
                 <p className="text-[10px] text-gray-400 uppercase font-bold">{v.fecha}</p>
               </div>
            </div>

            <div className="flex-1 md:px-10">
               <p className="text-xs text-gray-400 uppercase font-black tracking-widest leading-none">Cliente</p>
               <p className="font-bold text-gray-700 mt-1 flex items-center gap-2">
                 <User size={14} className="text-gray-400" /> {v.cliente}
               </p>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto">
               <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black">Monto Total</p>
                  <p className="text-xl font-black text-gray-800">${v.total.toFixed(2)}</p>
               </div>
               <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                 v.estado === 'COMPLETADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
               }`}>
                 {v.estado}
               </div>
               <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                  <ArrowUpRight size={20} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
