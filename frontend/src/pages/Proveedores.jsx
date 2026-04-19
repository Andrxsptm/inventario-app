import { useState } from 'react'
import { Truck, Mail, Phone, ExternalLink, Globe, X, MapPin, Notebook, Box } from 'lucide-react'
import Button from '../components/common/Button'

const MOCK_PROVEEDORES = [
  { id: 1, nombre: 'Lácteos del Sur S.A.', correo: 'ventas@lacteossur.com', tel: '+57 322 100 0000', productos: 12 },
  { id: 2, nombre: 'Distribuidora Global', correo: 'contacto@dglobal.com', tel: '+57 311 200 1122', productos: 45 },
  { id: 3, nombre: 'Ingenio Azucarero Central', correo: 'info@ingazucar.com', tel: '+57 301 333 4455', productos: 5 },
  { id: 4, nombre: 'Café de la Sierra', correo: 'pedidos@cafesierra.co', tel: '+57 315 444 5566', productos: 8 },
  { id: 5, nombre: 'Frutas y Verduras Organix', correo: 'hola@organix.com', tel: '+57 318 777 8899', productos: 24 },
  { id: 6, nombre: 'Carnes de Origen', correo: 'ventas@carnes.co', tel: '+57 300 999 0001', productos: 15 },
]

const VISITAS_PROGRAMADAS = [
  { id: 1, proveedor: 'Lácteos del Sur', fecha: '20 Abril', hora: '09:00 AM', status: 'confirmado' },
  { id: 2, proveedor: 'Distribuidora Global', fecha: '22 Abril', hora: '14:30 PM', status: 'pendiente' },
  { id: 3, proveedor: 'Café de la Sierra', fecha: '25 Abril', hora: '10:00 AM', status: 'confirmado' },
  { id: 4, proveedor: 'Organix', fecha: '28 Abril', hora: '08:00 AM', status: 'pendiente' },
]

function VisitCalendar() {
  return (
    <div className="card h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Próximas Visitas</h2>
        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
           <Truck size={16} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {VISITAS_PROGRAMADAS.map(v => (
          <div key={v.id} className="relative pl-4 border-l-2 border-amber-200 py-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-800">{v.proveedor}</p>
                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                  {v.fecha} • {v.hora}
                </p>
              </div>
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                v.status === 'confirmado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {v.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Button variant="amber" className="w-full mt-auto border border-amber-100">
        Gestionar Agenda Completa
      </Button>
    </div>
  )
}

export default function Proveedores() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-10 uppercase tracking-tighter">
      
      {/* Modal - Agregar Proveedor */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-modal-in">
            {/* Modal Header */}
            <div className="p-6 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                  <Truck className="text-amber-500" size={24} />
                  Nuevo Proveedor
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Registrar aliado comercial</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-amber-100 text-amber-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre de la Empresa</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors">
                    <Globe size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Ej. Distribuidora Central S.A."
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="+57..."
                      className="w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      placeholder="ventas@ejemplo.com"
                      className="w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección Física</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Calle 123 #45-67, Ciudad"
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notas Adicionales</label>
                <div className="relative group">
                  <div className="absolute left-4 top-5 text-gray-300 group-focus-within:text-amber-500 transition-colors">
                    <Notebook size={18} />
                  </div>
                  <textarea 
                    rows="2"
                    placeholder="Observaciones sobre entregas, pagos, etc."
                    className="w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-700 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <Button 
                variant="amber" 
                className="flex-[2]"
                onClick={() => {/* Lógica de guardado */}}
              >
                Guardar Proveedor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header (Minimal Style) */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <Truck className="text-amber-500" size={28} />
             Proveedores y Alianzas
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Directorio de abastecimiento logístico</p>
        </div>
        <Button 
          variant="amber" 
          onClick={() => setShowModal(true)}
        >
          + Nuevo Proveedor
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch h-[calc(100vh-210px)] min-h-[500px]">
        {/* Main List with Scroll */}
        <div className="lg:col-span-3 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {MOCK_PROVEEDORES.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-all border-l-8 border-l-amber-400 shrink-0">
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

        {/* Calendar Sidebar - Full Height */}
        <div className="lg:col-span-1 h-full">
          <VisitCalendar />
        </div>
      </div>
    </div>
  )
}
