import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', campus: '', city: '', role: 'USER' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      await register(form)
      navigate('/books')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-sm max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Create Account</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="First Name" 
              required
              value={form.firstName} 
              onChange={(e) => setForm({ ...form, firstName: e.target.value })} 
            />
            <Input 
              label="Last Name" 
              required
              value={form.lastName} 
              onChange={(e) => setForm({ ...form, lastName: e.target.value })} 
            />
          </div>
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
            label="Campus" 
            value={form.campus} 
            onChange={(e) => setForm({ ...form, campus: e.target.value })} 
          />
          <Input 
            label="City" 
            value={form.city} 
            onChange={(e) => setForm({ ...form, city: e.target.value })} 
          />
          <div>
            <label className="text-sm block mb-1">Account Type</label>
            <select 
              value={form.role} 
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-slate-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
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
