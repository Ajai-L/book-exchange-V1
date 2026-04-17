import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', city: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    try {
      const parts = form.name.split(' ');
      const payload = {
          ...form,
          firstName: parts[0],
          lastName: parts.slice(1).join(' ') || ''
      };
      await register(payload)
      navigate('/books')
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Registration failed'
      const details = err?.response?.data?.details
      if (details && Array.isArray(details)) {
        const detailText = details.map(d => `${d.field}: ${d.message}`).join(', ')
        setError(`${errorMsg} - ${detailText}`)
      } else {
        setError(errorMsg)
      }
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-sm max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            required
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
          />
          <Input 
            label="Email" 
            type="email"
            required
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          <Input 
            label="Password" 
            type="password" 
            required
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            required
            value={form.confirmPassword} 
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} 
          />
          <Input 
            label="City" 
            value={form.city} 
            onChange={(e) => setForm({ ...form, city: e.target.value })} 
          />
          <Button type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
        <p className="text-center text-sm mt-4 text-slate-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
