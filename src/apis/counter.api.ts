/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const counterApi = {
  getCounters: (params: any) => http.get(`/counters?_t=${Date.now()}`, { params }),
  postCounter: (data: any) => http.post(`/counters`, data),
  editCounter: (slug: string, data: any) => http.put(`/counters/${slug}`, data),
  deleteCounter: (id: string) => http.delete(`/counters/${id}`)
}
