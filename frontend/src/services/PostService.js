import api from "./api";

export const getPosts = (page = 0, size = 10) =>
  api.get(`/api/posts`, { params: { page, size } });

export const getUserPosts = (userId, page = 0, size = 10) =>
  api.get(`/api/posts/user/${userId}`, { params: { page, size } });

export const createPost = (payload) => api.post(`/api/posts`, payload);

export const updatePost = (postId, payload) => api.put(`/api/posts/${postId}`, payload);

export const deletePost = (postId) => api.delete(`/api/posts/${postId}`);

export const toggleLike = (postId) => api.post(`/api/posts/${postId}/like`);
