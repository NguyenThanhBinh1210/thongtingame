import { Profile, Wallet } from '~/types/auth.type'

export const setAccesTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}
export const getWalletFromLS = () => {
  const result = localStorage.getItem('wallet')
  return result ? JSON.parse(result) : null
}
export const getDarkModeFromLS = () => {
  const result = localStorage.getItem('darkmode')
  return result ? JSON.parse(result) : null
}
export const getSecurityFromLS = () => {
  const result = localStorage.getItem('security')
  return result ? JSON.parse(result) : null
}

export const setProfileFromLS = (profile: Profile) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
export const setWalletFromLS = (profile: Wallet) => {
  localStorage.setItem('wallet', JSON.stringify(profile))
}
export const setDarkModeFromLS = (dark: boolean) => {
  localStorage.setItem('darkmode', JSON.stringify(dark))
}
export const setSecurityFromLS = (dark: boolean) => {
  localStorage.setItem('security', JSON.stringify(dark))
}
