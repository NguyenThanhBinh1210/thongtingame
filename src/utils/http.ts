import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccesTokenToLS,
  setProfileFromLS,
  setRefreshTokenToLS
} from './auth'
import { LoginResponse } from '~/types/auth.type'
import { toast } from 'react-toastify'

function createHttp(): AxiosInstance {
  let accessToken: string | null = getAccessTokenFromLS()
  let refreshToken: string | null = getRefreshTokenFromLS()
  // let refreshTokenRequest: Promise<string> | null = null

  const instance = axios.create({
    baseURL: 'https://be-lol.onrender.com/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (accessToken && config.headers) {
        config.headers['authorization'] = `Bearer ${accessToken}`
        return config
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const { url } = response.config
      if (url === '/auth/login') {
        const loginResponse = response.data as LoginResponse
        console.log(loginResponse)

        const dataProfile = loginResponse.data.user
        console.log(loginResponse)
        accessToken = loginResponse.data.accessToken
        refreshToken = loginResponse.data.refreshToken
        if (loginResponse.status === 'success') {
          setProfileFromLS(dataProfile)
          setAccesTokenToLS(accessToken)
          setRefreshTokenToLS(refreshToken)
          window.location.href = '/'
        }
      } else if (url === '/auth/log-out') {
        accessToken = ''
        refreshToken = ''
        clearLS()
      }
      return response
    },
    (error) => {
      // Kiểm tra nếu response trả về unauthorized
      if (error.response?.data?.statusCode === 401) {
        // Xóa token và thông tin người dùng
        toast.error('Phiên đăng nhập hết hạn vui lòng đăng nhập lại')
        accessToken = ''
        refreshToken = ''
        clearLS()
        // Chuyển hướng về trang login
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  // async function handleRefreshToken(): Promise<string> {
  //   try {
  //     const response = await instance.post<RefreshTokenResponse>('/auth/refresh-token', {
  //       refreshToken: refreshToken
  //     })
  //     if (response.data.statusCode === 200) {
  //       const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data
  //       setAccesTokenToLS(newAccessToken)
  //       setRefreshTokenToLS(newRefreshToken)
  //       accessToken = newAccessToken
  //       refreshToken = newRefreshToken
  //       return newAccessToken
  //     }

  //     throw new Error('Refresh token failed')
  //   } catch (error) {
  //     clearLS()
  //     accessToken = ''
  //     refreshToken = ''
  //     throw error
  //   }
  // }

  return instance
}

const http = createHttp()

export default http
