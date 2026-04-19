import { Users, UserPlus, Mail, Phone, MapPin, Search } from 'lucide-react'
import Button from '../components/common/Button'

const MOCK_CLIENTES = [
  { id: 1, nombre: 'Andrxs Ptm', correo: 'andrxs@email.com', telefono: '300 123 4567', total: 1250.50, initial: 'A' },
  { id: 2, nombre: 'Camila Rosales', correo: 'camila@design.co', telefono: '310 987 6543', total: 450.00, initial: 'C' },
  { id: 3, nombre: 'Javier Domínguez', correo: 'javi.dom@work.com', telefono: '315 555 1234', total: 2800.00, initial: 'J' },
  { id: 4, nombre: 'Sofía Martínez', correo: 'sofia.mtz@live.com', telefono: '320 111 2233', total: 120.00, initial: 'S' },
]

export default function Clientes() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">
      
      {/* Header (Minimal Style) */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <Users className="text-indigo-500" size={28} />
             Cartera de Clientes
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Directorio de clientes registrados en el sistema</p>
        </div>
        <Button icon={UserPlus}>
           Registrar Cliente
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
        <Search size={20} className="text-gray-300" />
        <input type="text" placeholder="Buscar cliente por nombre o correo..." className="bg-transparent border-none outline-none text-sm w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_CLIENTES.map(c => (
           <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black mb-4 shadow-xl shadow-indigo-100 transform group-hover:rotate-12 transition-transform">
                {c.initial}
              </div>

              <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{c.nombre}</h3>
              <p className="text-xs text-gray-400 mb-6">{c.correo}</p>

              <div className="w-full space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 justify-center">
                  <Phone size={12} className="text-indigo-400" /> {c.telefono}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 justify-center">
                  <MapPin size={12} className="text-indigo-400" /> Bogotá, Colombia
                </div>
              </div>

              <div className="w-full pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Inversión Total</p>
                <p className="text-xl font-black text-indigo-600">${c.total.toLocaleString()}</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  )
}
