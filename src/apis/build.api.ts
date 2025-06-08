/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const buildApi = {
  getWRBuilds: (id: string) => http.get(`/wildrift/champions/${id}/builds`),
  postWRBuild: (data: any) => http.post(`/wildrift/builds`, data),
  editWRBuild: (slug: string, data: any) => http.put(`/wildrift/builds/${slug}`, data),
  deleteWRBuild: (id: string) => http.delete(`/wildrift/builds/${id}`)
}
