/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const championApi = {
  getChampions: (params: any) => http.get('/champions', { params }),
  getTFTChampions: (params: any) => http.get('/tft/champions', { params }),
  getWRChampions: (params: any) => http.get('/wildrift/champions', { params })
}
