import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Bell, LogOut, Key, ChevronDown, AlertTriangle,
  Truck, CheckCircle2, Clock, UserPlus, X, Eye, EyeOff,
  Loader2, ShieldCheck, User
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

/* ─────────────────────────────────────────────────────────────────── */
/* Helpers                                                              */
/* ─────────────────────────────────────────────────────────────────── */
function urlAvatar(nombre = '') {
  const initials = nombre.split(' ').slice(0, 2).map(w => w[0]).join('+')
  return `https://ui-avatars.com/api/?name=${initials}&background=6d28d9&color=fff&bold=true`
}

function tiempoAtras(date) {
  if (!date) return ''
  const diff = (Date.now() - new Date(date).getTime()) / 1000
  if (diff < 60) return 'Ahora'
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`
  return `Hace ${Math.floor(diff / 86400)} días`
}

const ALERT_STYLES = {
  agotado:       { icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-50' },
  stock_bajo:    { icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-50' },
  orden_pendiente:{ icon: Truck,        color: 'text-blue-500',   bg: 'bg-blue-50' },
  default:       { icon: Clock,         color: 'text-violet-500', bg: 'bg-violet-50' },
}

/* ─────────────────────────────────────────────────────────────────── */
/* Sub-panels                                                           */
/* ─────────────────────────────────────────────────────────────────── */
function PanelAgregarVendedor({ onClose }) {
  const [form, setForm]   = useState({ nombre: '', email: '', password: '', rol: 'VENDEDOR' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)

  async function manejarEnvio(e) {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.password) {
      setError('Todos los campos son obligatorios.')
      return
    }
    setLoading(true); setError('')
    try {
      await api.post('/auth/register', form)
      setSuccess(true)
      setTimeout(onClose, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el usuario.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
              <UserPlus size={14} className="text-violet-500" /> Agregar Vendedor
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Crea una nueva cuenta de acceso
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xs font-black text-green-600 uppercase tracking-tighter">¡Usuario creado!</p>
          </div>
        ) : (
          <form onSubmit={manejarEnvio} className="space-y-3.5">
            {[
              { label: 'Nombre completo', key: 'nombre', type: 'text', placeholder: 'Ej. María García' },
              { label: 'Correo electrónico', key: 'email', type: 'email', placeholder: 'maria@empresa.com' },
              { label: 'Contraseña temporal', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  disabled={loading}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                />
              </div>
            ))}

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                Rol
              </label>
              <select
                value={form.rol}
                onChange={e => setForm({ ...form, rol: e.target.value })}
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
              >
                <option value="VENDEDOR">Vendedor</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
                {loading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function PanelCambiarPassword({ onClose }) {
  const [form, setForm]     = useState({ passwordActual: '', passwordNueva: '', confirmar: '' })
  const [show, setShow]     = useState({ actual: false, nueva: false, confirmar: false })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)

  async function manejarEnvioContrasena(e) {
    e.preventDefault()
    if (!form.passwordActual || !form.passwordNueva || !form.confirmar) {
      setError('Todos los campos son obligatorios.'); return
    }
    if (form.passwordNueva === form.passwordActual) {
      setError('La nueva contraseña no puede ser igual a la actual.'); return
    }
    if (form.passwordNueva !== form.confirmar) {
      setError('Las contraseñas nuevas no coinciden.'); return
    }
    if (form.passwordNueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.'); return
    }
    setLoading(true); setError('')
    try {
      await api.put('/auth/cambiar-password', {
        passwordActual: form.passwordActual,
        passwordNueva: form.passwordNueva,
      })
      setSuccess(true)
      setTimeout(onClose, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: 'Contraseña actual', key: 'passwordActual', showKey: 'actual' },
    { label: 'Nueva contraseña',  key: 'passwordNueva',  showKey: 'nueva' },
    { label: 'Confirmar nueva',   key: 'confirmar',      showKey: 'confirmar' },
  ]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
              <Key size={14} className="text-violet-500" /> Cambiar Contraseña
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Actualiza tu contraseña de acceso
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xs font-black text-green-600 uppercase tracking-tighter">¡Contraseña actualizada!</p>
          </div>
        ) : (
          <form onSubmit={manejarEnvioContrasena} className="space-y-3.5">
            {fields.map(({ label, key, showKey }) => (
              <div key={key}>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={show[showKey] ? 'text' : 'password'}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-500 transition-colors"
                  >
                    {show[showKey] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-60 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Key size={13} />}
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */
/* Logout Confirmation Panel                                            */
/* ─────────────────────────────────────────────────────────────────── */
function PanelConfirmarLogout({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-xs p-6
        animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
            <LogOut size={24} className="text-red-500" />
          </div>
        </div>
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter text-center">
          ¿Cerrar sesión?
        </h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-1 mb-5">
          Perderás el acceso hasta iniciar sesión de nuevo
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <LogOut size={13} /> Salir
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */
/* Navbar principal                                                     */
/* ─────────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const { user, cerrarSesion } = useAuthStore()

  /* Dropdowns mutuamente exclusivos */
  const [openPanel, setOpenPanel] = useState(null) // 'notif' | 'user' | null

  /* Sub-paneles modales */
  const [showAddUser,     setShowAddUser]     = useState(false)
  const [showChangePass,  setShowChangePass]  = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  /* Alertas */
  const [alertas, setAlertas]     = useState([])
  const [loadingAlertas, setLoadingAlertas] = useState(false)

  /* Cargar alertas al montar */
  useEffect(() => {
    setLoadingAlertas(true)
    api.get('/auth/alertas')
      .then(r => setAlertas(r.data.alertas || []))
      .catch(() => setAlertas([]))
      .finally(() => setLoadingAlertas(false))
  }, [])

  const alternarPanel = (panel) =>
    setOpenPanel(prev => prev === panel ? null : panel)

  function manejarCerrarSesion() {
    setShowLogoutConfirm(true)
    setOpenPanel(null)
  }

  function confirmarCerrarSesion() {
    cerrarSesion()
    navigate('/login')
  }

  const unread = alertas.length

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 relative z-50">
        {/* Page title area — vacío, se puede extender */}
        <div />

        <div className="flex items-center gap-3">

          {/* ── Notificaciones ── */}
          <div className="relative">
            <button
              id="btn-notificaciones"
              onClick={() => alternarPanel('notif')}
              className={`relative p-2 rounded-xl transition-all duration-200 ${
                openPanel === 'notif'
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-gray-400 hover:text-violet-600 hover:bg-violet-50'
              }`}
            >
              <Bell size={19} />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            {openPanel === 'notif' && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setOpenPanel(null)} />
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 animate-in zoom-in-95 fade-in slide-in-from-top-4 duration-200">
                  {/* Header */}
                  <div className="px-5 py-3 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Alertas</h3>
                    {unread > 0 && (
                      <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {unread} {unread === 1 ? 'Alerta' : 'Alertas'}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                    {loadingAlertas ? (
                      <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Cargando...</span>
                      </div>
                    ) : alertas.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 py-10 text-gray-300">
                        <CheckCircle2 size={28} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Sin alertas activas</p>
                      </div>
                    ) : (
                      alertas.map(alerta => {
                        const style = ALERT_STYLES[alerta.tipo] || ALERT_STYLES.default
                        const IconComp = style.icon
                        return (
                          <div
                            key={alerta.id}
                            className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50/50 last:border-0 group"
                          >
                            <div className="flex gap-3">
                              <div className={`w-9 h-9 rounded-xl ${style.bg} ${style.color} flex items-center justify-center shrink-0`}>
                                <IconComp size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-gray-800 leading-tight group-hover:text-violet-600 transition-colors">
                                  {alerta.titulo}
                                </p>
                                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">
                                  {alerta.mensaje}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock size={9} className="text-gray-300" />
                                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                                    {tiempoAtras(alerta.fecha)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 pt-2">
                    <button
                      onClick={() => { setOpenPanel(null); navigate('/dashboard') }}
                      className="w-full py-2.5 text-[10px] font-black text-violet-600 bg-violet-50 rounded-2xl hover:bg-violet-100 transition-colors uppercase tracking-widest"
                    >
                      Ver dashboard completo
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Usuario ── */}
          <div className="relative">
            <button
              id="btn-usuario"
              onClick={() => alternarPanel('user')}
              className="flex items-center gap-2.5 group focus:outline-none bg-gray-50/50 pr-3 rounded-full hover:bg-violet-50 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full border-2 border-white group-hover:border-violet-200 transition-all overflow-hidden shadow-sm shrink-0">
                <img src={urlAvatar(user?.nombre)} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[10px] font-black text-gray-800 leading-tight">
                  {user?.nombre?.split(' ')[0] ?? 'Usuario'}
                </p>
                <p className="text-[8px] font-bold text-violet-600 uppercase tracking-widest">
                  {user?.rol ?? '—'}
                </p>
              </div>
              <ChevronDown
                size={12}
                className={`text-gray-400 transition-transform duration-200 ${openPanel === 'user' ? 'rotate-180' : ''}`}
              />
            </button>

            {openPanel === 'user' && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setOpenPanel(null)} />

                <div className="absolute right-0 mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 animate-in zoom-in-95 fade-in slide-in-from-top-4 duration-200 overflow-hidden">

                  {/* User header */}
                  <div className="px-6 py-4 flex flex-col items-center text-center gap-2.5 border-b border-gray-50 mb-2">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner ring-4 ring-violet-50">
                      <img src={urlAvatar(user?.nombre)} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-base font-black text-gray-800 leading-tight">
                          {user?.nombre ?? 'Usuario'}
                        </p>
                        {user?.rol === 'ADMINISTRADOR' && (
                          <span className="bg-violet-100 text-violet-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-0.5">
                            <ShieldCheck size={8} /> Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{user?.email ?? '—'}</p>
                      <p className="inline-block mt-2 bg-gray-50 text-[9px] font-bold text-gray-500 uppercase tracking-widest px-3 py-1 rounded-full border border-gray-100">
                        {user?.rol ?? '—'}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="px-3 space-y-0.5">

                    {/* Solo ADMINISTRADOR puede agregar vendedores */}
                    {user?.rol === 'ADMINISTRADOR' && (
                      <button
                        id="btn-agregar-vendedor"
                        onClick={() => { setOpenPanel(null); setShowAddUser(true) }}
                        className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-black text-gray-500 hover:bg-violet-50 hover:text-violet-600 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <UserPlus size={15} className="text-gray-300 group-hover:text-violet-500 transition-colors" />
                          <span>Agregar Vendedor</span>
                        </div>
                        <ChevronDown size={13} className="-rotate-90 text-gray-300 group-hover:text-violet-400" />
                      </button>
                    )}

                    <button
                      id="btn-cambiar-password"
                      onClick={() => { setOpenPanel(null); setShowChangePass(true) }}
                      className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-black text-gray-500 hover:bg-violet-50 hover:text-violet-600 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Key size={15} className="text-gray-300 group-hover:text-violet-500 transition-colors" />
                        <span>Cambiar Contraseña</span>
                      </div>
                      <ChevronDown size={13} className="-rotate-90 text-gray-300 group-hover:text-violet-400" />
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="mt-2 px-3 pt-2 border-t border-gray-50">
                    <button
                      id="btn-cerrar-sesion"
                      onClick={manejarCerrarSesion}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-[0.98]"
                    >
                      <LogOut size={15} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Sub-paneles modales */}
      {showAddUser       && <PanelAgregarVendedor  onClose={() => setShowAddUser(false)} />}
      {showChangePass    && <PanelCambiarPassword  onClose={() => setShowChangePass(false)} />}
      {showLogoutConfirm && (
        <PanelConfirmarLogout
          onConfirm={confirmarCerrarSesion}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  )
}
