import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/auth.service'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    if (!token || typeof token !== 'string') return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    return JSON.parse(atob(payload))
  } catch (e) {
    console.error('Token decode error:', e)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeFromToken()
  }, [])

  async function initializeFromToken() {
    const t = localStorage.getItem('token')
    if (t) {
      const payload = decodeToken(t)
      if (payload) {
        const name = payload.firstName && payload.lastName ? `${payload.firstName} ${payload.lastName}` : payload.name || 'User'
        setUser({ id: payload.sub, role: payload.role, name, firstName: payload.firstName, lastName: payload.lastName })
        setToken(t)
      }
    }
    setLoading(false)
  }

  async function login(credentials) {
    setLoading(true)
    const res = await authService.login(credentials)
    const t = res.token
    localStorage.setItem('token', t)
    const payload = decodeToken(t)
    const name = payload.firstName && payload.lastName ? `${payload.firstName} ${payload.lastName}` : payload.name || 'User'
    setUser({ id: payload.sub, role: payload.role, name, firstName: payload.firstName, lastName: payload.lastName })
    setToken(t)
    setLoading(false)
    return res
  }

  async function register(data) {
    setLoading(true)
    const res = await authService.register(data)
    if (res && res.token) {
      localStorage.setItem('token', res.token)
      const payload = decodeToken(res.token)
      const name = payload.firstName && payload.lastName ? `${payload.firstName} ${payload.lastName}` : payload.name || 'User'
      setUser({ id: payload.sub, role: payload.role, name, firstName: payload.firstName, lastName: payload.lastName })
      setToken(res.token)
    }
    setLoading(false)
    return res
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, token, role: user?.role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
