/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const championApi = {
  getChampions: (params: any) => http.get(`/champions?_t=${Date.now()}`, { params }),
  postChampion: (data: any) => http.post(`/champions`, data),
  editChampion: (slug: string, data: any) => http.put(`/champions/${slug}`, data),
  getTFTChampions: (params: any) => http.get(`/tft/champions?_t=${Date.now()}`, { params }),
  getWRChampions: (params: any) => http.get(`/wildrift/champions?_t=${Date.now()}`, { params })
}
