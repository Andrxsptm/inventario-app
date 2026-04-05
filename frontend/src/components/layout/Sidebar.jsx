import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Tag,
  Truck, Users, ClipboardList, CheckSquare,
} from 'lucide-react'

const links = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Reporte' },
  { to: '/inventario',  icon: Package,          label: 'Inventario' },
  { to: '/ventas',      icon: ShoppingCart,     label: 'Ventas' },
  { to: '/productos',   icon: Tag,              label: 'Productos' },
  { to: '/compras',     icon: ClipboardList,    label: 'Compras' },
  { to: '/proveedores', icon: Truck,            label: 'Proveedores' },
  { to: '/clientes',    icon: Users,            label: 'Clientes' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-primary flex flex-col py-6 px-3 gap-1 shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg">
          <CheckSquare size={20} className="text-white" />
        </div>
        <span className="ml-3 text-white font-semibold text-sm tracking-wide">
          InvenSmart
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
