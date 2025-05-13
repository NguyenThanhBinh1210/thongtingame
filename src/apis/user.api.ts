import http from '~/utils/http'

export const createUser = (body: {
  username: string
  password: string
  fullName: string
  email: string
  mobile: string
  walletBalance?: number
}) => {
  return http.post('/users', body)
}
export const getAccount = (params?: { limit?: number; page?: number }) => {
  return http.get('/users', { params })
}
