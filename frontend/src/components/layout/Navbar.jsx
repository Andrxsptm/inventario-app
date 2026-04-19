import { useState } from 'react'
import { Bell, UserCircle, LogOut, Key, User, ChevronDown, AlertTriangle, Truck, CheckCircle2, Clock } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'

const titles = {
  '/dashboard':   '',
  '/inventario':  '',
  '/ventas':      '',
  '/productos':   '',
  '/compras':     '',
  '/proveedores': '',
  '/clientes':    '',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'InvenSmart'
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Datos mock de notificaciones basados en el schema
  const notifications = [
    { 
      id: 1, 
      type: 'low_stock', 
      title: 'Stock Crítico', 
      msg: 'Leche Deslactosada tiene solo 2 unidades (Mín: 10)', 
      time: 'Hace 5 min',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    { 
      id: 2, 
      type: 'order_pending', 
      title: 'Pedido en Camino', 
      msg: 'Orden #502 de Lácteos del Sur llega hoy', 
      time: 'Hace 1 hora',
      icon: Truck,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    { 
      id: 3, 
      type: 'stock_ok', 
      title: 'Reposición Exitosa', 
      msg: 'Se ha actualizado el stock de Café Premium', 
      time: 'Ayer',
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    { 
      id: 4, 
      type: 'low_stock', 
      title: 'Alerta de Precio', 
      msg: 'Cambio detectado en productos de limpieza', 
      time: '2 días',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    },
    { 
      id: 5, 
      type: 'info', 
      title: 'Mantenimiento', 
      msg: 'Respaldo de base de datos completado', 
      time: '3 días',
      icon: Clock,
      color: 'text-violet-500',
      bg: 'bg-violet-50'
    }
  ]

  // Datos mock del usuario
  const user = {
    nombre: 'Andrés Mendoza',
    email: 'andres.mendoza@empresa.com',
    rol: 'Administrador',
    foto: 'https://ui-avatars.com/api/?name=Andres+Mendoza&background=6d28d9&color=fff'
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 relative z-50">
      <h1 className="text-sm font-black text-gray-700 uppercase tracking-tighter">{title}</h1>
      
      <div className="flex items-center gap-5">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl transition-all duration-300 ${
              showNotifications ? 'bg-violet-50 text-violet-600' : 'text-gray-400 hover:text-violet-600 hover:bg-violet-50'
            }`}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 animate-in zoom-in-95 fade-in slide-in-from-top-4 duration-300">
                <div className="px-6 py-3 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Notificaciones</h3>
                  <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full">3 Nuevas</span>
                </div>
                
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.slice(0, 4).map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50/50 last:border-0 group">
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-xl ${n.bg} ${n.color} flex items-center justify-center shrink-0`}>
                          <n.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black text-gray-800 leading-tight group-hover:text-violet-600 transition-colors">{n.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{n.msg}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={10} className="text-gray-300" />
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3">
                  <button className="w-full py-2.5 text-[10px] font-black text-violet-600 bg-violet-50 rounded-2xl hover:bg-violet-100 transition-colors uppercase tracking-widest mt-1">
                    Ver todas las alertas en Dashboard
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 group focus:outline-none bg-gray-50/50 pr-3 rounded-full hover:bg-violet-50 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full border-2 border-white group-hover:border-violet-200 transition-all overflow-hidden shadow-sm">
              <img src={user.foto} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[10px] font-black text-gray-800 leading-tight">{user.nombre.split(' ')[0]}</p>
              <p className="text-[8px] font-bold text-violet-600 uppercase tracking-widest">{user.rol}</p>
            </div>
            <ChevronDown size={12} className={`text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu Card */}
          {showUserMenu && (
            <>
              {/* Overlay for closing */}
              <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserMenu(false)} />
              
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 animate-in zoom-in-95 fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                {/* User Header */}
                <div className="px-6 py-4 flex flex-col items-center text-center gap-3 border-b border-gray-50 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 font-black overflow-hidden relative shadow-inner ring-4 ring-violet-50">
                    <img src={user.foto} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-base font-black text-gray-800 leading-tight">{user.nombre}</p>
                      <span className="bg-violet-100 text-violet-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">PRO</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{user.email}</p>
                    <p className="inline-block mt-2 bg-gray-50 text-[9px] font-bold text-gray-500 uppercase tracking-widest px-3 py-1 rounded-full border border-gray-100">
                      Rol: {user.rol}
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="px-3 space-y-1">
                  <Link 
                    to="/cambiar-password" 
                    className="flex items-center justify-between px-4 py-3 text-[11px] font-black text-gray-500 hover:bg-violet-50 hover:text-violet-600 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Key size={16} className="text-gray-300 group-hover:text-violet-500 transition-colors" />
                      <span>Cambiar Contraseña</span>
                    </div>
                    <ChevronDown size={14} className="-rotate-90 text-gray-300 group-hover:text-violet-400" />
                  </Link>
                </div>

                <div className="mt-3 px-3">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all group active:scale-95">
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
