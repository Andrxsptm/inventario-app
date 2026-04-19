import { ShoppingCart, Clock, User, ArrowUpRight, CheckCircle2, DollarSign, Package, Users, Tag, Calendar } from 'lucide-react'
import Button from '../components/common/Button'

/* ─── DATOS DE DEMO (Alineados con schema.prisma) ─── */
const MOCK_VENTAS = [
  { 
    id: 1024, 
    fecha: '2026-04-18T14:10:00', 
    cliente: 'Andrés Mendoza', 
    vendedor: 'Beatriz Soler',
    items: [
      { producto: 'Café Premium', cant: 2, subtotal: 30.00 },
      { producto: 'Kit Limpieza', cant: 1, subtotal: 120.00 }
    ],
    total: 150.00, 
    estado: 'COMPLETADA',
    notas: 'Venta rápida en mostrador'
  },
  { 
    id: 1023, 
    fecha: '2026-04-18T12:30:00', 
    cliente: 'Empresa Logix', 
    vendedor: 'Carlos Páez',
    items: [
      { producto: 'Miel de Abeja', cant: 10, subtotal: 300.00 }
    ],
    total: 300.00, 
    estado: 'COMPLETADA' 
  },
  { 
    id: 1022, 
    fecha: '2026-04-17T09:15:00', 
    cliente: 'Consumidor Final', 
    vendedor: 'Beatriz Soler',
    items: [
      { producto: 'Harina 1kg', cant: 5, subtotal: 25.00 }
    ],
    total: 25.00, 
    estado: 'ANULADA',
    notas: 'Error en digitación de cantidad'
  },
]

export default function Ventas() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">
      
      {/* Header (Minimal Style) */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <ShoppingCart className="text-orange-500" size={28} />
             Flujo de Ventas
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Control de transacciones y facturación</p>
        </div>
        <Button icon={Tag}>
           Nueva Venta Directa
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <DollarSign size={24} />
           </div>
           <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Ventas de Hoy</p>
              <p className="text-2xl font-black text-gray-800">$450.00</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Package size={24} />
           </div>
           <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Productos Salientes</p>
              <p className="text-2xl font-black text-gray-800">17 uds.</p>
           </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <Users size={24} />
           </div>
           <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Clientes Atendidos</p>
              <p className="text-2xl font-black text-gray-800">12 Hoy</p>
           </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="card px-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
           <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Historial Reciente</h2>
           <div className="flex gap-2">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"><Calendar size={16}/></button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left border-b border-gray-50">
                <th className="px-6 py-4">ID / Fecha</th>
                <th className="px-6 py-4">Cliente / Vendedor</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_VENTAS.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-gray-700">V-{v.id}</p>
                    <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                       <Clock size={10} /> {new Date(v.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-[10px] font-black">
                          {v.cliente.charAt(0)}
                       </div>
                       <div>
                          <p className="text-[11px] font-bold text-gray-800">{v.cliente}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                             <User size={10} className="text-orange-400" /> {v.vendedor}
                          </p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                       <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-lg">
                          {v.items.length} Items
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-gray-800">${v.total.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      v.estado === 'COMPLETADA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${v.estado === 'COMPLETADA' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {v.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                       <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
