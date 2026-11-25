import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types/user'
import { clearStoredToken, getMeApi, getStoredToken, loginApi, registerApi } from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'register'
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(getStoredToken())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')

  const refreshUser = async () => {
    const currentToken = getStoredToken()
    if (!currentToken) {
      setUser(null)
      setIsLoading(false)
      return
    }
    try {
      const u = await getMeApi()
      setUser(u)
      setToken(currentToken)
    } catch {
      clearStoredToken()
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password })
    setUser(res.user)
    setToken(res.access_token)
    setIsAuthModalOpen(false)
  }

  const register = async (email: string, password: string, name: string) => {
    const res = await registerApi({ email, password, name })
    setUser(res.user)
    setToken(res.access_token)
    setIsAuthModalOpen(false)
  }

  const logout = () => {
    clearStoredToken()
    setUser(null)
    setToken(null)
  }

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

