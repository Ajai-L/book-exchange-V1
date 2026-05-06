import React, { useEffect, useState } from 'react'
import { getUsers, deleteUser, promoteUser, demoteUser } from '../../services/admin.service'
import Button from '../../components/common/Button'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId)
        setUsers(users.filter(u => u.id !== userId))
        alert('User deleted successfully')
      } catch (err) {
        alert('Failed to delete user: ' + err.response?.data?.message || err.message)
      }
    }
  }

  async function handlePromote(userId) {
    try {
      await promoteUser(userId)
      await loadUsers()
      alert('User promoted to admin successfully')
    } catch (err) {
      alert('Failed to promote user: ' + err.response?.data?.message || err.message)
    }
  }

  async function handleDemote(userId) {
    if (confirm('Are you sure you want to demote this admin?')) {
      try {
        await demoteUser(userId)
        await loadUsers()
        alert('Admin demoted to user successfully')
      } catch (err) {
        alert('Failed to demote admin: ' + err.response?.data?.message || err.message)
      }
    }
  }

  if (loading) return <div className="p-4">Loading users...</div>

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">User Management</h2>
      
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Books</th>
              <th className="px-4 py-3">Exchanges</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{user.first_name} {user.last_name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {user.city ? `${user.city}${user.campus ? ', ' + user.campus : ''}` : 'N/A'}
                </td>
                <td className="px-4 py-3 text-center">{user.total_books || 0}</td>
                <td className="px-4 py-3 text-center">{user.total_exchanges || 0}</td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedUser(user); setShowDetail(true) }}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      View
                    </button>
                    {user.role === 'USER' ? (
                      <button
                        onClick={() => handlePromote(user.id)}
                        className="text-green-600 hover:text-green-800 text-xs font-medium"
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDemote(user.id)}
                        className="text-orange-600 hover:text-orange-800 text-xs font-medium"
                      >
                        Demote
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetail && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">{selectedUser.first_name} {selectedUser.last_name}</h3>
            <div className="space-y-2 text-sm mb-6">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>City:</strong> {selectedUser.city || 'N/A'}</p>
              <p><strong>Campus:</strong> {selectedUser.campus || 'N/A'}</p>
              <p><strong>Bio:</strong> {selectedUser.bio || 'No bio'}</p>
              <p><strong>Books Listed:</strong> {selectedUser.total_books || 0}</p>
              <p><strong>Exchanges:</strong> {selectedUser.total_exchanges || 0}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => setShowDetail(false)}
              className="w-full bg-slate-300 hover:bg-slate-400 text-slate-800 font-medium py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
