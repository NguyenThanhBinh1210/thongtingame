/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const blogApi = {
  createBlog: (data: any) => http.post('/blogs', data),
  getBlogs: (languageCode?: string) => http.get('/blogs', { params: languageCode ? { languageCode } : {} }),
  deleteBlog: (id: string) => http.delete(`/blogs/${id}`),
  editBlog: (id: string, data: any) => http.put(`/blogs/${id}`, data),
  getCategories: () => http.get('/categories/level3')
}
