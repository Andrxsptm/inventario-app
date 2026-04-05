import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Tag,
  Truck, Users, ClipboardList, Settings, LogOut,
} from 'lucide-react'
import { AiOutlineLeft } from "react-icons/ai"
import logo from "../resourses/logo.png"

const links = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Reporte' },
  { to: '/inventario',  icon: Package, label: 'Inventario' },
  { to: '/ventas',      icon: ShoppingCart, label: 'Ventas' },
  { to: '/productos',   icon: Tag, label: 'Productos' },
  { to: '/compras',     icon: ClipboardList, label: 'Compras' },
  { to: '/proveedores', icon: Truck, label: 'Proveedores' },
  { to: '/clientes',    icon: Users, label: 'Clientes' }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`
      relative z-[100] flex flex-col h-screen bg-white
      border-r border-gray-200 py-5 shrink-0
      transition-all duration-300 ease-in-out overflow-hidden
      shadow-xl shadow-gray-200/50
      ${collapsed ? 'w-[60px]' : 'w-[220px]'}
    `}>

      {/* botón desplega sidebar*/}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-[650px] -right-[5px] z-10 w-[30px] h-[30px] rounded-s-3xl
          bg-gray-200 border border-gray-700 flex items-center justify-center
          hover:border-violet-600 transition-colors group shadow-sm"
      >
        <AiOutlineLeft size={12} className={`
          text-black group-hover:text-violet-600 transition-transform duration-300
          ${collapsed ? 'rotate-180' : ''}
        `}/>
      </button>

      {/* Logo Section */}
      <div className={`mb-10 mt-2 shrink-0 transition-all duration-300 ${collapsed ? 'px-0 flex justify-center' : 'px-5'}`}>
        <div className={`flex items-center transition-all duration-300 ${collapsed ? 'gap-0' : 'gap-4'}`}>
          <div className={`shrink-0 flex items-center justify-center bg-violet-50 rounded-2xl border border-violet-100 shadow-sm overflow-hidden group transition-all duration-300 ${collapsed ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-110" 
            />
          </div>
          <div className={`flex flex-col transition-all duration-300 ${collapsed ? 'opacity-0 w-0 invisible -translate-x-4' : 'opacity-100 w-auto visible translate-x-0'}`}>
            <span className="text-gray-900 font-extrabold text-xl tracking-tighter leading-none">
              Inventario
              <span className="text-violet-600">xd</span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 whitespace-nowrap">
              Management
            </span>
          </div>
        </div>
      </div>

      {/* Nav principal */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              relative flex items-center rounded-lg
              text-sm font-medium whitespace-nowrap overflow-hidden
              transition-all duration-150
              ${isActive
                ? 'bg-violet-50 text-violet-600 font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              ${collapsed ? 'justify-center px-0' : 'justify-start gap-3 px-2.5'}
              py-2.5
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-violet-600 rounded-r-full" />
                )}
                <Icon size={18} className="shrink-0" />
                <span className={`
                  transition-all duration-150
                  ${collapsed ? 'opacity-0 w-0 invisible' : 'opacity-100 w-auto visible'}
                `}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        <div className="my-2.5 mx-1 h-px bg-gray-100" />

        {/*Configuración y Salir — con label cuando está expandido */}
        {[
          { to: '/config', icon: Settings, label: 'Configuración' },
          { to: '/salir',  icon: LogOut,   label: 'Salir' },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              relative flex items-center rounded-lg
              text-sm font-medium whitespace-nowrap overflow-hidden
              transition-all duration-150
              ${isActive
                ? 'bg-violet-50 text-violet-600 font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              ${collapsed ? 'justify-center px-0' : 'justify-start gap-3 px-2.5'}
              py-2.5
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-violet-600 rounded-r-full" />
                )}
                <Icon size={18} className="shrink-0" />
                <span className={`
                  transition-all duration-150
                  ${collapsed ? 'opacity-0 w-0 invisible' : 'opacity-100 w-auto visible'}
                `}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}