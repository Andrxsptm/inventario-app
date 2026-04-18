import { Truck, Mail, Phone, ExternalLink, Globe } from 'lucide-react'

const MOCK_PROVEEDORES = [
  { id: 1, nombre: 'Lácteos del Sur S.A.', correo: 'ventas@lacteossur.com', tel: '+57 322 100 0000', productos: 12 },
  { id: 2, nombre: 'Distribuidora Global', correo: 'contacto@dglobal.com', tel: '+57 311 200 1122', productos: 45 },
  { id: 3, nombre: 'Ingenio Azucarero Central', correo: 'info@ingazucar.com', tel: '+57 301 333 4455', productos: 5 },
]

export default function Proveedores() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-3">
            <Truck className="text-amber-500" size={24} />
            Proveedores y Alianzas
          </h1>
          <p className="text-sm text-gray-400 mt-1">Directorio de abastecimiento logístico</p>
        </div>
        <button className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-xs font-black relative z-10 hover:bg-amber-200 transition-colors">
          + Nuevo Proveedor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_PROVEEDORES.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-all border-l-8 border-l-amber-400">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-50 text-amber-500 rounded-2xl flex items-center justify-center border border-gray-100">
                <Globe size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800">{p.nombre}</h3>
                <div className="flex flex-wrap gap-4 mt-2">
                   <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Mail size={14} className="text-amber-400" /> {p.correo}
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Phone size={14} className="text-amber-400" /> {p.tel}
                   </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
               <div className="text-center md:text-right flex-1 md:flex-none">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Catálogo</p>
                  <p className="text-xl font-black text-gray-700">{p.productos} SKU</p>
               </div>
               <button className="p-3 bg-gray-50 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition-all">
                  <ExternalLink size={20} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
