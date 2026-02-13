import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate('/books')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-sm max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2">OpenShelf</h1>
        <p className="text-slate-600 mb-6">Sign in to your account</p>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email"
            required
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            label="Password" 
            type="password" 
            required
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="text-center text-sm mt-4 text-slate-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  )
}
