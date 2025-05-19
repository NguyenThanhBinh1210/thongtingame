/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const pcApi = {
  createPC: (data: any) => http.post('/pc-build/builds', data),
  getPCBuild: (params: any) => http.get('/pc-build/builds', { params }),
  getHistoryMatch: (params: any) => http.get('/pc-build/lol-history', { params }),
  deleteBlog: (id: string) => http.delete(`/blogs/${id}`),
  editBlog: (id: string, data: any) => http.put(`/blogs/${id}`, data),
  getCategories: () => http.get('/categories/level3')
}
