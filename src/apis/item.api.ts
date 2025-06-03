/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const itemApi = {
  getTFTItems: (params: any) => http.get(`/tft/items?_t=${Date.now()}`, { params }),
  postTFTItem: (data: any) => http.post(`/tft/items`, data),
  editTFTItem: (slug: string, data: any) => http.put(`/tft/items/${slug}`, data),
  deleteTFTItem: (id: string) => http.delete(`/tft/items/${id}`)
}
