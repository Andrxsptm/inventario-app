import { Bell, UserCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles = {
  '/dashboard':   'Reporte General',
  '/inventario':  'Inventario',
  '/ventas':      'Ventas',
  '/productos':   'Productos',
  '/compras':     'Órdenes de Compra',
  '/proveedores': 'Proveedores',
  '/clientes':    'Clientes',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'InvenSmart'

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <UserCircle size={22} />
        </button>
      </div>
    </header>
  )
}
