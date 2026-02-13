import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()
  
  if (!user) return <div className="p-4">Loading profile...</div>
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white p-6 rounded border border-slate-200 space-y-4">
        <div>
          <label className="text-sm text-slate-600">First Name</label>
          <p className="text-lg font-semibold">{user.firstName || 'N/A'}</p>
        </div>
        <div>
          <label className="text-sm text-slate-600">Last Name</label>
          <p className="text-lg font-semibold">{user.lastName || 'N/A'}</p>
        </div>
        <div>
          <label className="text-sm text-slate-600">Account Type</label>
          <p className="text-lg font-semibold">
            <span className={`px-3 py-1 rounded text-white ${user.role === 'ADMIN' ? 'bg-red-600' : 'bg-blue-600'}`}>
              {user.role === 'ADMIN' ? 'Admin' : 'User'}
            </span>
          </p>
        </div>
        <div className="pt-4 border-t">
          <h2 className="font-semibold mb-3">Quick Links</h2>
          <div className="space-y-2">
            <Link to="/my-books" className="block text-blue-600 hover:underline">📚 My Books</Link>
            <Link to="/my-exchanges" className="block text-blue-600 hover:underline">🔄 My Exchanges</Link>
            {user.role === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" className="block text-blue-600 hover:underline">📊 Admin Dashboard</Link>
                <Link to="/admin/users" className="block text-blue-600 hover:underline">👥 Manage Users</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
