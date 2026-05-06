import api from './api'

export function getAnalytics() {
  return api.get('/admin/analytics').then(r => r.data)
}

export function getUsers() {
  return api.get('/admin/users').then(r => r.data)
}

export function getUserDetail(id) {
  return api.get(`/admin/users/${id}`).then(r => r.data)
}

export function deleteUser(id) {
  return api.delete(`/admin/users/${id}`).then(r => r.data)
}

export function promoteUser(id) {
  return api.patch(`/admin/users/${id}/promote`, {}).then(r => r.data)
}

export function demoteUser(id) {
  return api.patch(`/admin/users/${id}/demote`, {}).then(r => r.data)
}

export function getBooks() {
  return api.get('/admin/books').then(r => r.data)
}

export function deleteBook(id) {
  return api.delete(`/admin/books/${id}`).then(r => r.data)
}

export function getExchanges() {
  return api.get('/admin/exchanges').then(r => r.data)
}

export function updateExchangeStatus(id, status) {
  return api.patch(`/admin/exchanges/${id}/status`, { status }).then(r => r.data)
}
