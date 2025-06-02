/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '~/utils/http'

export const commentApi = {
  getCommentsChampion: (id: string) => http.get(`/comments/champion/${id}?_t=${Date.now()}`),
  getCommentsBlog: (id: string) => http.get(`/comments/news/${id}?_t=${Date.now()}`),
  getCommentsPCbuild: (id: string) => http.get(`/comments/pc-build/${id}?_t=${Date.now()}`),
  deleteComment: (id: string) => http.delete(`/comments/${id}`)
}
