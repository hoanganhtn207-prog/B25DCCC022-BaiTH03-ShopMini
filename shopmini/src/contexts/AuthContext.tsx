import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const STORAGE_KEY = 'shopmini-user'
const VALID_PASSWORD = '123456'
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function loadUser(): User | null {
  try {
    const name = localStorage.getItem(STORAGE_KEY)
    return name ? { username: name } : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser)

  // Đăng nhập giả lập: đúng khi password = "123456"
  const login = useCallback(async (username: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const name = username.trim()
    if (!name || password !== VALID_PASSWORD) return false
    setUser({ username: name })
    try {
      localStorage.setItem(STORAGE_KEY, name)
    } catch {
      /* bỏ qua */
    }
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* bỏ qua */
    }
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>')
  return ctx
}
