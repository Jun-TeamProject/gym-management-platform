import api from "./api";

export const getComments = (postId, page = 0, size = 5) =>
  api.get(`/api/comments/posts/${postId}`, { params: { page, size } });

export const createComment = (postId, payload) =>
  api.post(`/api/comments/posts/${postId}`, payload);

export const updateComment = (commentId, payload) =>
  api.put(`/api/comments/${commentId}`, payload);

export const deleteComment = (commentId) =>
  api.delete(`/api/comments/${commentId}`);
