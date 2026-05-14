import React, { useState, useEffect } from 'react'
import { 
  Settings, Database, ExternalLink, Shield, Lock, Download, LifeBuoy, History, 
  CheckCircle2, Clock, Building2, FileText, Palette, Save, Loader2, AlertTriangle
} from 'lucide-react'
import Button from '../components/common/Button'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function Configuracion() {
  const { user } = useAuthStore()
  const esAdmin = user?.rol === 'ADMINISTRADOR'
  const [notifications, setNotifications] = useState(true)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backups, setBackups] = useState(() => {
    const saved = localStorage.getItem('stocker_backups')
    return saved ? JSON.parse(saved) : []
  })

  // ── Estado para Configuración de Empresa ──
  const [empresa, setEmpresa] = useState({
    nombre: '', nit: '', direccion: '', telefono: '', correo: '', web: '',
    colorPrimario: '#f97316', piePagina: '¡Gracias por su confianza!', mostrarLogo: false
  })
  const [empresaLoading, setEmpresaLoading] = useState(true)
  const [empresaSaving, setEmpresaSaving] = useState(false)
  const [empresaMsg, setEmpresaMsg] = useState(null)

  // Cargar datos de empresa
  useEffect(() => {
    api.get('/configuracion/empresa')
      .then(r => setEmpresa(r.data))
      .catch(() => {})
      .finally(() => setEmpresaLoading(false))
  }, [])

  const manejarCambioEmpresa = (field, value) => {
    setEmpresa(prev => ({ ...prev, [field]: value }))
  }

  const manejarGuardadoEmpresa = async () => {
    setEmpresaSaving(true)
    setEmpresaMsg(null)
    try {
      const res = await api.put('/configuracion/empresa', empresa)
      setEmpresa(res.data)
      setEmpresaMsg({ type: 'success', text: 'Configuración guardada correctamente' })
      setTimeout(() => setEmpresaMsg(null), 3000)
    } catch {
      setEmpresaMsg({ type: 'error', text: 'Error al guardar la configuración' })
    } finally {
      setEmpresaSaving(false)
    }
  }

  // Simulación de Backup SQL real
  const manejarRespaldo = async () => {
    if (!esAdmin) return
    setIsBackingUp(true)
    try {
      const res = await api.post('/configuracion/backup-sql', {}, { responseType: 'blob' })
      const contentDisp = res.headers['content-disposition'] || ''
      const match = contentDisp.match(/filename="?([^"]+)"?/)
      const filename = match ? match[1] : `stocker_backup_${new Date().toISOString().slice(0,10)}.sql`
      const isSql = filename.endsWith('.sql')

      const blob = new Blob([res.data], { type: isSql ? 'application/sql' : 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = filename
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)

      const newBackup = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        size: `${(res.data.size / 1024).toFixed(1)} KB`,
        estado: 'Exitoso',
        formato: isSql ? 'SQL' : 'JSON'
      }
      const updatedBackups = [newBackup, ...backups].slice(0, 5)
      setBackups(updatedBackups)
      localStorage.setItem('stocker_backups', JSON.stringify(updatedBackups))
    } catch (err) {
      alert('Error al generar el respaldo: ' + (err.response?.data?.error || err.message))
    } finally {
      setIsBackingUp(false)
    }
  }

  const sections = [
    {
      id: 'seguridad',
      title: 'Seguridad y Datos',
      icon: Lock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      items: [
        { 
          label: 'Notificaciones Críticas', 
          desc: 'Alertas inmediatas de stock bajo y pedidos', 
          action: (
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-7 rounded-full transition-all relative border-2 ${notifications ? 'bg-amber-500 border-amber-600' : 'bg-gray-100 border-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${notifications ? 'right-1' : 'left-1'}`} />
            </button>
          )
        },
        { 
          label: 'Exportar Base de Datos', 
          desc: esAdmin ? 'Descarga un respaldo SQL real de la base de datos' : 'Solo el administrador puede hacer respaldos', 
          action: esAdmin ? (
            <button 
              onClick={manejarRespaldo}
              disabled={isBackingUp}
              className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-tighter hover:bg-amber-50 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
            >
              <Download size={14} /> {isBackingUp ? 'Generando...' : 'Descargar SQL'}
            </button>
          ) : (
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter flex items-center gap-1"><AlertTriangle size={12} /> Sin acceso</span>
          )
        }
      ]
    },
    {
      id: 'soporte',
      title: 'Centro de Soporte',
      icon: LifeBuoy,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      items: [
        { label: 'Documentación stocker', desc: 'Guía completa de módulos', action: <button className="p-2 bg-gray-50 rounded-xl hover:bg-blue-50 text-blue-500 transition-colors"><ExternalLink size={16} /></button> },
        { label: 'Historial de Cambios', desc: 'Ver novedades de la v2.4', action: <button className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"><History size={16} /></button> }
      ]
    }
  ]

  // Campos del emisor
  const camposEmisor = [
    { key: 'nombre', label: 'Nombre de la empresa', icon: Building2, placeholder: 'Mi Empresa S.A.S' },
    { key: 'nit', label: 'NIT', icon: FileText, placeholder: '000.000.000-0' },
    { key: 'direccion', label: 'Dirección', icon: Building2, placeholder: 'Calle 123 #45-67' },
    { key: 'telefono', label: 'Teléfono', icon: Building2, placeholder: '+57 300 000 0000' },
    { key: 'correo', label: 'Correo electrónico', icon: Building2, placeholder: 'correo@empresa.com' },
    { key: 'web', label: 'Sitio web', icon: Building2, placeholder: 'www.empresa.com' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">
      
      {/* Header Minimalista */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <div className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
                <Settings className="text-gray-400" size={20} />
             </div>
             Ajustes del Sistema
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Configuración central de Stocker</p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={manejarRespaldo} icon={Database} disabled={isBackingUp || !esAdmin}>
             {isBackingUp ? 'Generando...' : esAdmin ? 'Backup Maestro' : 'Sin acceso'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Columna izquierda: Datos del Emisor + Secciones */}
        <div className="space-y-6">
          
          {/* ── DATOS DEL EMISOR ── */}
          <div className="bg-white rounded-[2.5rem] p-3 border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/40">
             <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center shadow-inner">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Datos del Emisor</h2>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Información de la empresa para facturación</p>
                </div>
             </div>
             <div className="bg-gray-50/50 rounded-[2rem] p-6 mt-2 space-y-4">
                {empresaLoading ? (
                  <div className="py-6 flex items-center justify-center gap-2 text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-[10px] font-bold uppercase">Cargando...</span>
                  </div>
                ) : (
                  <>
                    {camposEmisor.map(campo => (
                      <div key={campo.key}>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">{campo.label}</label>
                        <input
                          type="text"
                          value={empresa[campo.key] || ''}
                          onChange={e => manejarCambioEmpresa(campo.key, e.target.value)}
                          placeholder={campo.placeholder}
                          className="w-full bg-white border-2 border-gray-100 focus:border-orange-400 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-700 outline-none transition-all normal-case tracking-normal"
                        />
                      </div>
                    ))}
                    
                    {empresaMsg && (
                      <div className={`text-[10px] font-bold px-4 py-2.5 rounded-xl ${empresaMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {empresaMsg.text}
                      </div>
                    )}
                  </>
                )}
             </div>
          </div>

          {/* Secciones existentes */}
          {sections.map(section => (
            <div key={section.id} className="bg-white rounded-[2.5rem] p-3 border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/40">
               <div className="px-6 py-4 flex items-center gap-4">
                  <div className={`w-12 h-12 ${section.bg} ${section.color} rounded-3xl flex items-center justify-center shadow-inner`}>
                    <section.icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">{section.title}</h2>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Módulo de gestión</p>
                  </div>
               </div>
               <div className="bg-gray-50/50 rounded-[2rem] p-6 mt-2 space-y-6">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center px-2">
                       <div>
                          <p className="text-[11px] font-black text-gray-700">{item.label}</p>
                          <p className="text-[10px] text-gray-400 font-bold lowercase italic leading-tight">{item.desc}</p>
                       </div>
                       <div className="shrink-0">{item.action}</div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Columna derecha: Personalización de Factura + Backups */}
        <div className="space-y-6">
          
          {/* ── PERSONALIZACIÓN DE FACTURA ── */}
          <div className="bg-white rounded-[2.5rem] p-3 border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/40">
             <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-50 text-violet-500 rounded-3xl flex items-center justify-center shadow-inner">
                  <Palette size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Personalización de Factura</h2>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Apariencia del documento PDF</p>
                </div>
             </div>
             <div className="bg-gray-50/50 rounded-[2rem] p-6 mt-2 space-y-5">
                {empresaLoading ? (
                  <div className="py-6 flex items-center justify-center gap-2 text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-[10px] font-bold uppercase">Cargando...</span>
                  </div>
                ) : (
                  <>
                    {/* Color primario */}
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Color principal de la factura</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={empresa.colorPrimario || '#f97316'}
                          onChange={e => manejarCambioEmpresa('colorPrimario', e.target.value)}
                          className="w-12 h-10 rounded-xl border-2 border-gray-100 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-gray-500 normal-case tracking-normal">{empresa.colorPrimario}</span>
                        <div className="flex-1 h-6 rounded-lg" style={{ backgroundColor: empresa.colorPrimario }} />
                      </div>
                    </div>
                    
                    {/* Pie de página */}
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Texto del pie de página</label>
                      <textarea
                        value={empresa.piePagina || ''}
                        onChange={e => manejarCambioEmpresa('piePagina', e.target.value)}
                        rows={2}
                        className="w-full bg-white border-2 border-gray-100 focus:border-violet-400 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-700 outline-none transition-all resize-none normal-case tracking-normal"
                        placeholder="¡Gracias por su confianza!"
                      />
                    </div>
                    
                    {/* Toggle logo */}
                    <div className="flex justify-between items-center px-1">
                      <div>
                        <p className="text-[11px] font-black text-gray-700">Mostrar logo</p>
                        <p className="text-[10px] text-gray-400 font-bold lowercase italic">incluir logo de empresa en la factura</p>
                      </div>
                      <button 
                        onClick={() => manejarCambioEmpresa('mostrarLogo', !empresa.mostrarLogo)}
                        className={`w-14 h-7 rounded-full transition-all relative border-2 ${empresa.mostrarLogo ? 'bg-violet-500 border-violet-600' : 'bg-gray-100 border-gray-200'}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${empresa.mostrarLogo ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>

                    {/* Botón guardar */}
                    <button
                      onClick={manejarGuardadoEmpresa}
                      disabled={empresaSaving}
                      className="w-full py-3 text-xs font-black uppercase tracking-widest text-white bg-orange-500 hover:bg-orange-600 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {empresaSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {empresaSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </>
                )}
             </div>
          </div>

          {/* Panel de Registro de Backups */}
          <div className="bg-white rounded-[2.5rem] p-3 border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/40">
             <div className="px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center shadow-inner">
                  <Database size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Registro de Backups</h2>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">Últimas copias de seguridad guardadas</p>
                </div>
             </div>
             <div className="bg-gray-50/50 rounded-[2rem] p-6 mt-2">
                {backups.length === 0 ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center text-gray-300">
                     <Clock size={32} className="mb-2" />
                     <p className="text-[10px] font-bold uppercase tracking-widest">No hay backups recientes</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {backups.map((backup) => (
                      <div key={backup.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                               <CheckCircle2 size={16} />
                            </div>
                            <div>
                               <p className="text-[11px] font-black text-gray-700">{new Date(backup.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                               <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{backup.size}</p>
                            </div>
                         </div>
                         <span className="bg-green-50 text-green-600 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                           {backup.estado}
                         </span>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
