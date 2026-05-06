import React, { useEffect, useState } from 'react'
import { getAnalytics } from '../../services/admin.service'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      setLoading(true)
      const data = await getAnalytics()
      setStats(data)
    } catch (err) {
      console.error('Failed to load analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (!stats) return <div className="p-4 text-red-600">Failed to load statistics</div>

  const StatCard = ({ label, value, color = 'blue' }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6`}>
      <p className={`text-${color}-700 text-sm font-medium`}>{label}</p>
      <p className={`text-3xl font-bold text-${color}-900 mt-2`}>{value}</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard label="Admin Accounts" value={stats.totalAdmins} color="purple" />
        <StatCard label="Total Books" value={stats.totalBooks} color="green" />
        <StatCard label="Total Exchanges" value={stats.totalExchanges} color="orange" />
        <StatCard label="Completed Exchanges" value={stats.completedExchanges} color="emerald" />
        <StatCard label="Pending Exchanges" value={stats.pendingExchanges} color="yellow" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 Platform Overview</h3>
        <ul className="text-blue-700 space-y-2">
          <li>✓ {stats.totalUsers} active users on the platform</li>
          <li>✓ {stats.totalAdmins} admin accounts for management</li>
          <li>✓ {stats.totalBooks} books available for exchange</li>
          <li>✓ Success rate: {stats.totalExchanges > 0 ? Math.round((stats.completedExchanges / stats.totalExchanges) * 100) : 0}% ({stats.completedExchanges}/{stats.totalExchanges} exchanges completed)</li>
        </ul>
      </div>

      <div className="mt-6 bg-slate-100 rounded-lg p-4 text-sm text-slate-600">
        <p>Use the navigation menu to manage users, books, and exchanges. You can view detailed information, delete inappropriate content, and manage user roles.</p>
      </div>
    </div>
  )
}
