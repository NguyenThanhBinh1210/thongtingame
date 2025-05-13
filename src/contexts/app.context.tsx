/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react'
import { Profile } from '~/types/auth.type'
import { clearLS, getAccessTokenFromLS, getDarkModeFromLS, getProfileFromLS, getSecurityFromLS } from '~/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  isDark: boolean
  setDark?: any
  isSecurity: boolean
  setSecurity?: any
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: Profile | null
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>
  reset: () => void
}
export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
  isDark: Boolean(getDarkModeFromLS()),
  setDark: () => null,
  isSecurity: Boolean(getSecurityFromLS()),
  setSecurity: () => null
})
const initialAppContext = getInitialAppContext()

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<Profile | null>(initialAppContext.profile)
  const [isDark, setDark] = useState<boolean>(initialAppContext.isDark)
  const [isSecurity, setSecurity] = useState<boolean>(initialAppContext.isSecurity)
  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    clearLS()
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
        isDark,
        setDark,
        isSecurity,
        setSecurity
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
