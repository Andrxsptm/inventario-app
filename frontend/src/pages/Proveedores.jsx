import { useEffect, useState } from 'react'
import { Truck, Mail, Phone, Globe, X, MapPin, Notebook, Loader2, Pencil, Trash2, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react'
import api from '../services/api'

/* ─── Modal agregar/editar proveedor ─── */
function ModalProveedor({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id
  const [form,   setForm]   = useState(initial ?? { nombre: '', telefono: '', correo: '', direccion: '', notas: '' })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/proveedores/${initial.id}`, form)
      } else {
        await api.post('/proveedores', form)
      }
      setSuccess(true)
      setTimeout(() => { onSaved(); onClose() }, 1200)
    } catch {
      setError('Error al guardar el proveedor.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-gray-50 border-2 border-gray-50 focus:border-amber-400 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none transition-all'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-modal-in">

        <div className="p-5 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Truck className="text-amber-500" size={20} />
              {isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {isEdit ? 'Actualiza los datos del proveedor' : 'Registrar aliado comercial'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-100 text-amber-600 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-xs font-black text-green-600 uppercase tracking-tighter">
              {isEdit ? '¡Proveedor actualizado!' : '¡Proveedor creado!'}
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              {[
                { label: 'Nombre de la Empresa *', key: 'nombre', icon: Globe, type: 'text', placeholder: 'Distribuidora Central S.A.' },
                { label: 'Correo Electrónico',     key: 'correo', icon: Mail,  type: 'email', placeholder: 'ventas@ejemplo.com' },
                { label: 'Teléfono',               key: 'telefono', icon: Phone, type: 'tel', placeholder: '+57...' },
                { label: 'Dirección',              key: 'direccion', icon: MapPin, type: 'text', placeholder: 'Calle 123 #45-67' },
                { label: 'Notas',                  key: 'notas', icon: Notebook, type: 'text', placeholder: 'Observaciones...' },
              ].map(({ label, key, icon: Icon, type, placeholder }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors">
                      <Icon size={16} />
                    </div>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}
            </div>

            <div className="p-5 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] py-2.5 text-xs font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-60 rounded-2xl flex items-center justify-center gap-2 transition-all"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Guardar Proveedor'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── Panel lateral activos ─── */
function PanelActivos({ proveedores }) {
  const activos = proveedores.filter(p => p.activo)
  return (
    <div className="card h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Proveedores Activos</h2>
        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
          <Truck size={16} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {activos.slice(0, 8).map(p => (
          <div key={p.id} className="relative pl-4 border-l-2 border-amber-200 py-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-800">{p.nombre}</p>
                <p className="text-[10px] text-gray-400 font-medium">{p.correo ?? 'Sin correo'}</p>
              </div>
              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-600 shrink-0">
                activo
              </span>
            </div>
          </div>
        ))}
        {activos.length === 0 && (
          <p className="text-xs text-gray-300 font-bold text-center py-4">Sin proveedores activos</p>
        )}
      </div>
      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center">
        {activos.length} de {proveedores.length} activos
      </p>
    </div>
  )
}

/* ─── Página principal ─── */
export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [modal,       setModal]       = useState(null)   // null | 'new' | {proveedor}
  const [confirmDel,  setConfirmDel]  = useState(null)   // proveedor a eliminar

  function load() {
    setLoading(true)
    api.get('/proveedores')
      .then(r => setProveedores(r.data))
      .catch(() => setError('No se pudieron cargar los proveedores'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function toggleActivo(p) {
    try {
      await api.put(`/proveedores/${p.id}/toggle-activo`)
      load()
    } catch { alert('Error al cambiar estado') }
  }

  async function eliminar(p) {
    try {
      await api.delete(`/proveedores/${p.id}`)
      setConfirmDel(null)
      load()
    } catch { alert('Error al eliminar el proveedor') }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative pb-10 uppercase tracking-tighter">

      {/* Modal crear/editar */}
      {modal && (
        <ModalProveedor
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}

      {/* Confirm delete */}
      {confirmDel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setConfirmDel(null)} />
          <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-xs p-6 animate-in zoom-in-95 fade-in duration-200 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} />
            </div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter">¿Eliminar proveedor?</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-5">
              {confirmDel.nombre} quedará inactivo
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDel(null)} className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                Cancelar
              </button>
              <button onClick={() => eliminar(confirmDel)} className="flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all active:scale-[0.98]">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <Truck className="text-amber-500" size={28} />
            Proveedores y Alianzas
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
            Directorio de abastecimiento logístico
          </p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all active:scale-[0.98] shadow-sm"
        >
          <Truck size={14} /> + Nuevo Proveedor
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch" style={{ minHeight: 500 }}>

        {/* Main list */}
        <div className="lg:col-span-3 overflow-y-auto pr-2 custom-scrollbar space-y-4" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-white h-24 rounded-2xl border border-gray-100" />
            ))
          ) : proveedores.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-300 text-sm font-bold uppercase py-16">
              No hay proveedores registrados
            </div>
          ) : (
            proveedores.map(p => (
              <div
                key={p.id}
                className={`bg-white p-5 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-lg transition-all border-l-8 shrink-0 ${
                  p.activo ? 'border-l-amber-400' : 'border-l-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 text-amber-500 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0">
                    <Globe size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-800">{p.nombre}</h3>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Mail size={12} className="text-amber-400" /> {p.correo ?? '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Phone size={12} className="text-amber-400" /> {p.telefono ?? '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                  {/* Estado badge */}
                  <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                    p.activo ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>

                  {/* Toggle activo */}
                  <button
                    onClick={() => toggleActivo(p)}
                    title={p.activo ? 'Desactivar' : 'Activar'}
                    className="p-2.5 rounded-xl text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-all"
                  >
                    {p.activo ? <ToggleRight size={18} className="text-amber-500" /> : <ToggleLeft size={18} />}
                  </button>

                  {/* Editar */}
                  <button
                    onClick={() => setModal(p)}
                    className="p-2.5 rounded-xl text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => setConfirmDel(p)}
                    className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Side panel */}
        <div className="lg:col-span-1">
          <PanelActivos proveedores={proveedores} />
        </div>
      </div>
    </div>
  )
}
