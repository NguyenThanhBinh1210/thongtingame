/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const championApi = {
  getChampions: (params: any) => http.get(`/champions?_t=${Date.now()}`, { params }),
  postChampion: (data: any) => http.post(`/champions`, data),
  editChampion: (slug: string, data: any) => http.put(`/champions/${slug}`, data),
  deleteChampion: (id: string) => http.delete(`/champions/${id}`),
  getTFTChampions: (params: any) => http.get(`/tft/champions?_t=${Date.now()}`, { params }),
  postTFTChampion: (data: any) => http.post(`/tft/champions`, data),
  editTFTChampion: (slug: string, data: any) => http.put(`/tft/champions/${slug}`, data),
  deleteTFTChampion: (id: string) => http.delete(`/tft/champions/${id}`),
  getWRChampions: (params: any) => http.get(`/wildrift/champions?_t=${Date.now()}`, { params }),
  postWRChampion: (data: any) => http.post(`/wildrift/champions`, data),
  editWRChampion: (slug: string, data: any) => http.put(`/wildrift/champions/${slug}`, data),
  deleteWRChampion: (id: string) => http.delete(`/wildrift/champions/${id}`)
}
