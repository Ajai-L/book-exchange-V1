import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function Profile() {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    city: '',
    campus: '',
    bio: ''
  })

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        city: user.city || '',
        campus: user.campus || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  async function handleSave() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      })
      
      if (!response.ok) throw new Error('Failed to update profile')
      
      setEditing(false)
      alert('Profile updated successfully!')
      // Refresh page to get updated info
      window.location.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  if (!user) return <div className="p-4 text-center py-12">Loading profile...</div>
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
        {!editing ? (
          <>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 font-semibold">First Name</label>
                  <p className="text-lg text-slate-900 mt-1">{user.firstName || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600 font-semibold">Last Name</label>
                  <p className="text-lg text-slate-900 mt-1">{user.lastName || '—'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 font-semibold">Email</label>
                <p className="text-lg text-slate-900 mt-1">{user.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 font-semibold">City</label>
                  <p className="text-lg text-slate-900 mt-1">{user.city || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600 font-semibold">Campus</label>
                  <p className="text-lg text-slate-900 mt-1">{user.campus || '—'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600 font-semibold">Account Type</label>
                <p className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded text-white text-sm font-semibold ${
                    user.role === 'ADMIN' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {user.role === 'ADMIN' ? '👑 Admin' : '👤 User'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setEditing(true)} className="flex-1">
                Edit Profile
              </Button>
              <Button onClick={logout} className="flex-1 bg-red-600 hover:bg-red-700">
                Logout
              </Button>
            </div>
          </>
        ) : (
          <>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            
            <div className="space-y-4 mb-6">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />

              <Input
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />

              <Input
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <Input
                label="Campus"
                value={form.campus}
                onChange={(e) => setForm({ ...form, campus: e.target.value })}
              />

              <div>
                <label className="text-sm font-semibold block mb-2">Bio (Optional)</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="border border-slate-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Tell others about yourself..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link to="/my-books" className="p-4 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">
              <p className="font-semibold text-blue-900">📚 My Books</p>
              <p className="text-sm text-blue-700">Manage your listings</p>
            </Link>
            <Link to="/my-exchanges" className="p-4 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors">
              <p className="font-semibold text-green-900">🔄 My Exchanges</p>
              <p className="text-sm text-green-700">View exchange requests</p>
            </Link>
            <Link to="/books" className="p-4 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors">
              <p className="font-semibold text-purple-900">🔍 Browse Books</p>
              <p className="text-sm text-purple-700">Find books to exchange</p>
            </Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin/dashboard" className="p-4 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors">
                <p className="font-semibold text-red-900">📊 Admin Dashboard</p>
                <p className="text-sm text-red-700">Manage platform</p>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
