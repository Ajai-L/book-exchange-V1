import api from './api'

export function requestExchange(bookId) {
  return api.post('/exchanges', { bookId }).then(r => r.data)
}

export function getMyExchanges() {
  return api.get('/exchanges/my').then(r => r.data)
}

export function acceptExchange(id) {
  return api.post(`/exchanges/${id}/accept`).then(r => r.data)
}

export function rejectExchange(id) {
  return api.post(`/exchanges/${id}/reject`).then(r => r.data)
}

export function completeExchange(id) {
  return api.post(`/exchanges/${id}/complete`).then(r => r.data)
}
