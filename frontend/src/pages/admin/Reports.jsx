import React, { useEffect, useState } from 'react'
import { getExchanges, updateExchangeStatus } from '../../services/admin.service'

export default function Reports() {
  const [exchanges, setExchanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadExchanges()
  }, [])

  async function loadExchanges() {
    try {
      setLoading(true)
      const data = await getExchanges()
      setExchanges(data)
    } catch (err) {
      console.error('Failed to load exchanges:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(exchangeId, newStatus) {
    try {
      await updateExchangeStatus(exchangeId, newStatus)
      setExchanges(exchanges.map(e => 
        e.id === exchangeId ? { ...e, status: newStatus } : e
      ))
      alert(`Exchange marked as ${newStatus}`)
    } catch (err) {
      alert('Failed to update exchange: ' + err.response?.data?.message || err.message)
    }
  }

  if (loading) return <div className="p-4">Loading exchanges...</div>

  const filteredExchanges = filterStatus === 'all'
    ? exchanges
    : exchanges.filter(e => e.status === filterStatus)

  const stats = {
    total: exchanges.length,
    pending: exchanges.filter(e => e.status === 'PENDING').length,
    accepted: exchanges.filter(e => e.status === 'ACCEPTED').length,
    completed: exchanges.filter(e => e.status === 'COMPLETED').length,
    rejected: exchanges.filter(e => e.status === 'REJECTED').length
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Exchange Management</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-700 text-sm font-medium">Accepted</p>
          <p className="text-2xl font-bold text-orange-900">{stats.accepted}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm font-medium">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterStatus('PENDING')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            filterStatus === 'PENDING'
              ? 'bg-yellow-600 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilterStatus('ACCEPTED')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            filterStatus === 'ACCEPTED'
              ? 'bg-orange-600 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          Accepted ({stats.accepted})
        </button>
        <button
          onClick={() => setFilterStatus('COMPLETED')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            filterStatus === 'COMPLETED'
              ? 'bg-green-600 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          Completed ({stats.completed})
        </button>
        <button
          onClick={() => setFilterStatus('REJECTED')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            filterStatus === 'REJECTED'
              ? 'bg-red-600 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExchanges.map(exchange => (
              <tr key={exchange.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p className="font-medium">{exchange.book_title}</p>
                    <p className="text-xs text-slate-600">{exchange.author}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p className="font-medium">{exchange.requester_first_name} {exchange.requester_last_name}</p>
                    <p className="text-xs text-slate-600">{exchange.requester_email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p className="font-medium">{exchange.owner_first_name} {exchange.owner_last_name}</p>
                    <p className="text-xs text-slate-600">{exchange.owner_email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    exchange.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : exchange.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : exchange.status === 'ACCEPTED'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {exchange.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {new Date(exchange.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {exchange.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleStatusUpdate(exchange.id, 'COMPLETED')}
                        className="text-green-600 hover:text-green-800 text-xs font-medium"
                      >
                        ✓
                      </button>
                    )}
                    {exchange.status !== 'REJECTED' && exchange.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleStatusUpdate(exchange.id, 'REJECTED')}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
