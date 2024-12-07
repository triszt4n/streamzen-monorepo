import { createContext, PropsWithChildren } from "react"
import { useMe } from "./use-me.hook"

type AuthContextType = {
  authenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const { data, isLoading } = useMe()

  const onLogin = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/login`
  }

  const onLogout = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/logout`
  }

  const value = {
    authenticated: !!data,
    isLoading,
    login: onLogin,
    logout: onLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
