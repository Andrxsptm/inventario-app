import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import logo from '../components/resourses/logo.png'

export default function Login() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion)

  async function manejarEnvio(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      iniciarSesion(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 p-8">

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-violet-50 border border-violet-100 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <img src={logo} alt="Stocklat logo" className="w-9 h-9 object-contain" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
              Stock<span className="text-violet-600">lat</span>
            </h1>
          </div>

          {/* Section title */}
          <div className="mb-6">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
              <LogIn size={14} className="text-violet-500" />
              Iniciar Sesión
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Accede a tu cuenta
            </p>
          </div>

          {/* Form */}
          <form onSubmit={manejarEnvio} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                placeholder="usuario@correo.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-500 transition-colors"
                  tabIndex={-1}
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide px-3.5 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-black uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-violet-200 hover:shadow-md hover:shadow-violet-200 active:scale-[0.98]"
            >
                <><LogIn size={14} />Ingresar</>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
