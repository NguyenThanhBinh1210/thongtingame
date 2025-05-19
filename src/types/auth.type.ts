import { ROLES } from './role.type'
import { ResponseApi } from './utils.type'

export interface Profile {
  id: string
  name: string
  email: string
  role: ROLES
  avatar: string | null
}

export interface Wallet {
  username: string
  balance: number
  _id: string
}

export type AuthResponse = ResponseApi<{
  userInfos?: Profile
  wallets?: Profile

  tokenInfos?: {
    accessToken: string
    refreshToken: string
  }
}>

interface TokenInfo {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  data: {
    userData: Profile
    accessToken: string
    refreshToken: string
  }
  statusCode: number
  status: string
}

export interface RefreshTokenResponse {
  data: TokenInfo
  statusCode: number
}
