/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const pcApi = {
  createPC: (data: any) => http.post('/pc-build/builds', data),
  getPCBuild: (params: any) => http.get(`/pc-build/builds?_t=${Date.now()}`, { params }),
  getHistoryMatch: (params: any) => http.get(`/pc-build/lol-history?_t=${Date.now()}`, { params }),
  deletePC: (id: string) => http.delete(`/pc-build/builds/${id}`),
  editPC: (id: string, data: any) => http.put(`/pc-build/builds/${id}`, data),
  getCategories: () => http.get(`/categories/level3?_t=${Date.now()}`)
}
