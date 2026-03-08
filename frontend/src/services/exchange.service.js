import api from './api'

export function getExchanges(status = null) {
  const params = status ? { status } : {}
  return api.get('/exchanges', { params }).then(r => r.data)
}

export function getExchange(id) {
  return api.get(`/exchanges/${id}`).then(r => r.data)
}

export function createExchange(data) {
  return api.post('/exchanges', data).then(r => r.data)
}

export function updateExchange(id, status) {
  return api.put(`/exchanges/${id}`, { status }).then(r => r.data)
}

export function deleteExchange(id) {
  return api.delete(`/exchanges/${id}`).then(r => r.data)
}

export function acceptExchange(id) {
  return updateExchange(id, 'ACCEPTED')
}

export function rejectExchange(id) {
  return updateExchange(id, 'REJECTED')
}

export function completeExchange(id) {
  return updateExchange(id, 'COMPLETED')
}
