import api from './api'

// Profile endpoints
export function getUserProfile(userId) {
  return api.get(`/profiles/${userId}`).then(r => r.data)
}

export function updateProfile(userId, data) {
  return api.put(`/profiles/${userId}`, data).then(r => r.data)
}

export function rateUser(userId, exchangeId, rating, review) {
  return api.post(`/profiles/${userId}/rate`, { exchangeId, rating, review }).then(r => r.data)
}

// Book image endpoints
export function addBookImage(bookId, imageUrl) {
  return api.post(`/books/${bookId}/images`, { imageUrl }).then(r => r.data)
}

export function getBookImages(bookId) {
  return api.get(`/books/${bookId}/images`).then(r => r.data)
}

export function deleteBookImage(imageId) {
  return api.delete(`/books/images/${imageId}`).then(r => r.data)
}
