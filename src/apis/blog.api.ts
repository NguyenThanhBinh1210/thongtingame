/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const blogApi = {
  createBlog: (data: any) => http.post('/news', data),
  getBlogs: (params: any) => http.get('/news/admin?t=' + Date.now(), { params }),
  deleteBlog: (slug: string) => http.delete(`/news/${slug}`),
  editBlog: (slug: string, data: any) => http.put(`/news/${slug}`, data)
}
