import api from './api';

export const courseService = {
  getAll: (params) => api.get('/courses', { params }),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
  getById: (id) => api.get(`/courses/id/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  getMyCourses: () => api.get('/courses/my-courses'),
  toggleFeatured: (id) => api.put(`/courses/${id}/featured`),
  togglePublished: (id) => api.put(`/courses/${id}/published`),
};

export const lessonService = {
  getByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  getById: (id) => api.get(`/lessons/${id}`),
  create: (data) => api.post('/lessons', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`),
  reorder: (courseId, lessonIds) => api.put(`/lessons/reorder/${courseId}`, { lessonIds }),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const quizService = {
  getByCourse: (courseId) => api.get(`/quizzes/course/${courseId}`),
  getByLesson: (lessonId) => api.get(`/quizzes/lesson/${lessonId}`),
  getById: (id) => api.get(`/quizzes/${id}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  getAll: (params) => api.get('/quizzes', { params }),
};

export const assignmentService = {
  create: (data) => api.post('/assignments', data),
  getMy: () => api.get('/assignments/my'),
  getByCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
  updateStatus: (id, data) => api.put(`/assignments/${id}/status`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  getAll: (params) => api.get('/assignments/all', { params }),
};

export const certificateService = {
  generate: (courseId) => api.post(`/certificates/generate/${courseId}`),
  getMy: () => api.get('/certificates/my'),
  verify: (certificateId) => api.get(`/certificates/verify/${certificateId}`),
  getAll: () => api.get('/certificates'),
};

export const blogService = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  togglePublished: (id) => api.put(`/blogs/${id}/published`),
  getAllAdmin: () => api.get('/blogs/admin'),
};

export const reviewService = {
  getByCourse: (courseId) => api.get(`/reviews/course/${courseId}`),
  create: (data) => api.post('/reviews', data),
  approve: (id) => api.put(`/reviews/${id}/approve`),
  delete: (id) => api.delete(`/reviews/${id}`),
  getPending: () => api.get('/reviews/pending'),
  getAll: () => api.get('/reviews'),
};

export const commentService = {
  getByLesson: (lessonId) => api.get(`/comments/lesson/${lessonId}`),
  create: (data) => api.post('/comments', data),
  toggleLike: (id) => api.put(`/comments/${id}/like`),
  delete: (id) => api.delete(`/comments/${id}`),
  getAll: () => api.get('/comments/admin'),
  toggleApproval: (id) => api.put(`/comments/${id}/approve`),
};

export const notificationService = {
  getMy: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  create: (data) => api.post('/notifications', data),
};

export const paymentService = {
  checkout: (courseId) => api.post(`/payments/checkout/${courseId}`),
  confirm: (sessionId) => api.get(`/payments/confirm?session_id=${sessionId}`),
  getMy: () => api.get('/payments/my'),
  getAll: () => api.get('/payments'),
  getStats: () => api.get('/payments/stats'),
};

export const liveClassService = {
  getAll: (params) => api.get('/live-classes', { params }),
  getById: (id) => api.get(`/live-classes/${id}`),
  enroll: (id) => api.post(`/live-classes/${id}/enroll`),
  create: (data) => api.post('/live-classes', data),
  update: (id, data) => api.put(`/live-classes/${id}`, data),
  delete: (id) => api.delete(`/live-classes/${id}`),
};

export const progressService = {
  get: (courseId) => api.get(`/progress/${courseId}`),
  markLessonComplete: (courseId, lessonId) => api.put(`/progress/${courseId}/lesson/${lessonId}/complete`),
  saveWatch: (courseId, lessonId, data) => api.put(`/progress/${courseId}/lesson/${lessonId}/watch`, data),
  getWatchHistory: () => api.get('/progress/history/watch'),
  getCompleted: () => api.get('/progress/courses/completed'),
};

export const searchService = {
  search: (q, type) => api.get('/search', { params: { q, type } }),
};

export const dashboardService = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getStudentStats: () => api.get('/dashboard/student'),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleActive: (id) => api.put(`/users/${id}/toggle-active`),
  delete: (id) => api.delete(`/users/${id}`),
  toggleWishlist: (courseId) => api.put(`/users/wishlist/${courseId}`),
};

export const settingsService = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const uploadService = {
  single: (file, folder) => {
    const fd = new FormData();
    fd.append('image', file);
    if (folder) fd.append('folder', folder);
    return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  multiple: (files, folder) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    if (folder) fd.append('folder', folder);
    return api.post('/upload/multiple', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  delete: (publicId) => api.delete('/upload', { data: { publicId } }),
};
