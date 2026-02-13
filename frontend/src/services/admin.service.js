import api from './api'

export function getAnalytics() {
  return api.get('/admin/analytics').then(r => r.data)
}

export function getUsers() {
  return api.get('/admin/users').then(r => r.data)
}

export function blockUser(id) {
  return api.post(`/admin/users/${id}/block`).then(r => r.data)
}

export function getBooks() {
  return api.get('/admin/books').then(r => r.data)
}

export function deleteBook(id) {
  return api.delete(`/admin/books/${id}`).then(r => r.data)
}

export function getReports() {
  return api.get('/admin/reports').then(r => r.data)
}

export function resolveReport(id) {
  return api.post(`/admin/reports/${id}/resolve`).then(r => r.data)
}
