import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      iniciarSesion: (token, user) => set({ token, user, isAuthenticated: true }),

      cerrarSesion: () => set({ token: null, user: null, isAuthenticated: false }),

      esAdmin: () => {
        const state = useAuthStore.getState()
        return state.user?.rol === 'ADMINISTRADOR'
      },
    }),
    { name: 'auth-storage' }
  )
)
