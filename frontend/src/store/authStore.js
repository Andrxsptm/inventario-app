import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => set({ token, user, isAuthenticated: true }),

      logout: () => set({ token: null, user: null, isAuthenticated: false }),

      isAdmin: () => {
        const state = useAuthStore.getState()
        return state.user?.rol === 'ADMINISTRADOR'
      },
    }),
    { name: 'auth-storage' }
  )
)
