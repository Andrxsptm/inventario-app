import React, { useState, useEffect } from 'react'
import { 
  Settings, HelpCircle, Info, Moon, Sun, 
  ShieldCheck, Database, Bell, Globe, 
  Mail, MessageSquare, ExternalLink, Sparkles, Shield,
  Download, LifeBuoy, History, Lock
} from 'lucide-react'
import Button from '../components/common/Button'

export default function Configuracion() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  const [notifications, setNotifications] = useState(true)
  const [isBackingUp, setIsBackingUp] = useState(false)

  // Lógica de Modo Oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  // Simulación de Backup
  const handleBackup = () => {
    setIsBackingUp(true)
    setTimeout(() => {
      const data = { system: 'Stocker', version: '2.4', timestamp: new Date().toISOString() }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stocker_backup_${new Date().toISOString().slice(0,10)}.json`
      a.click()
      setIsBackingUp(false)
    }, 1500)
  }

  const sections = [
    {
      id: 'personalizacion',
      title: 'Apariencia y Estilo',
      icon: Sparkles,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      items: [
        { 
          label: 'Modo Oscuro', 
          desc: 'Optimiza la visualización para entornos con poca luz', 
          action: (
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-7 rounded-full transition-all relative border-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${darkMode ? 'right-1 bg-violet-500' : 'left-1 bg-white shadow-sm'}`}>
                {darkMode ? <Moon size={10} className="text-white" /> : <Sun size={10} className="text-amber-500" />}
              </div>
            </button>
          )
        }
      ]
    },
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
          desc: 'Descarga un respaldo completo en formato JSON', 
          action: (
            <button 
              onClick={handleBackup}
              disabled={isBackingUp}
              className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-tighter hover:bg-amber-50 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
            >
              <Download size={14} /> {isBackingUp ? 'Procesando...' : 'Descargar SQL'}
            </button>
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 uppercase tracking-tighter">
      
      {/* Header Minimalista */}
      <div className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
             <div className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
                <Settings className="text-gray-400" size={20} />
             </div>
             Ajustes del Sistema
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Configuración central de Stocker</p>
        </div>
        <Button onClick={handleBackup} icon={Database} disabled={isBackingUp}>
           {isBackingUp ? 'Generando...' : 'Backup Maestro'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Secciones de Ajustes */}
        <div className="space-y-6">
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
      </div>
    </div>
  )
}
