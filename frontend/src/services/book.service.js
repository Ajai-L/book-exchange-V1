import api from './api'

export function getBooks(query = {}) {
  return api.get('/books', { params: query }).then(r => r.data)
}

export function getBook(id) {
  return api.get(`/books/${id}`).then(r => r.data)
}

export function createBook(data) {
  return api.post('/books', data).then(r => r.data)
}

export function updateBook(id, data) {
  return api.put(`/books/${id}`, data).then(r => r.data)
}

export function deleteBook(id) {
  return api.delete(`/books/${id}`).then(r => r.data)
}
