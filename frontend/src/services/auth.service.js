import api from './api'

export async function login(credentials) {
  // TODO: Remove this mock login when backend is ready
  // For now, accept any credentials and return a mock token
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjhhZjkwNWQzNGM0ZjFmNzA0MzI3YmYiLCJuYW1lIjoiRGV2IFVzZXIiLCJmaXJzdE5hbWUiOiJEZXYiLCJsYXN0TmFtZSI6IlVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzA0MjI0MDB9.mock'
  return { token: mockToken }
}

export async function register(data) {
  const res = await api.post('/auth/register', data)
  return res.data
}

export async function getMe() {
  const res = await api.get('/auth/me')
  return res.data
}
