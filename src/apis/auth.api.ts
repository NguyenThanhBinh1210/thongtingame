import { LoginResponse, RefreshTokenResponse } from '~/types/auth.type'
import http from '~/utils/http'

export const loginAccount = (body: { email: string; password: string }): Promise<LoginResponse> => {
  return http.post('/auth/login', body)
}

export const refreshToken = (body: { refreshToken: string }): Promise<RefreshTokenResponse> => {
  return http.post('/auth/refresh-token', body)
}
