/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const commentApi = {
  getCommentsChampion: (id: string) => http.get(`/comments/champion/${id}`),
  getCommentsBlog: (id: string) => http.get(`/comments/news/${id}`),
  getCommentsPCbuild: (id: string) => http.get(`/comments/pc-build/${id}`),
  deleteComment: (id: string) => http.delete(`/comments/${id}`)
}
