import { Plus, Search, Edit2, Trash2, Package, Filter } from 'lucide-react'

const MOCK_PRODUCTOS = [
  { id: 1, nombre: 'Café Premium Juan Valdez', proveedor: 'Distribuidora Global', precioC: 8.50, precioV: 14.90, stock: 24, min: 10 },
  { id: 2, nombre: 'Azúcar Refinada 1kg', proveedor: 'Ingenio Azucarero', precioC: 1.20, precioV: 2.50, stock: 5, min: 20 },
  { id: 3, nombre: 'Leche Enterprise 1L', proveedor: 'Lácteos del Sur', precioC: 0.90, precioV: 1.80, stock: 45, min: 15 },
  { id: 4, nombre: 'Aceite de Girasol 900ml', proveedor: 'Aceitera Central', precioC: 2.10, precioV: 4.20, stock: 2, min: 10 },
  { id: 5, nombre: 'Arroz Grano Largo 5kg', proveedor: 'Arrocería San José', precioC: 4.50, precioV: 8.00, stock: 12, min: 5 },
]

export default function Productos() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package size={24} />
            </div>
            Catálogo de Productos
          </h1>
          <p className="text-sm text-gray-400 mt-1">Gestiona el inventario maestro de tu negocio</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 focus-within:border-blue-300 transition-all">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar productos por nombre, SKU o categoría..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all text-sm font-bold">
            <Filter size={18} /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-gray-400 font-bold uppercase tracking-widest text-[10px] border-b border-gray-100">
                <th className="px-4 py-3">Nombre del Producto</th>
                <th className="px-4 py-3">Proveedor Principal</th>
                <th className="px-4 py-3">Precio Compra</th>
                <th className="px-4 py-3">Precio Venta</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_PRODUCTOS.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-4 py-5">
                    <p className="font-bold text-gray-800">{p.nombre}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-medium">SKU: PRD-00{p.id}</p>
                  </td>
                  <td className="px-4 py-5 text-gray-500 font-medium">{p.proveedor}</td>
                  <td className="px-4 py-5 text-gray-600">${p.precioC.toFixed(2)}</td>
                  <td className="px-4 py-5 font-black text-blue-600">${p.precioV.toFixed(2)}</td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                        p.stock <= p.min ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {p.stock} UNIDADES
                      </span>
                      {p.stock <= p.min && <p className="text-[8px] text-red-400 mt-1 uppercase font-black">Stock Bajo</p>}
                    </div>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
