import React, { useEffect, useState } from 'react'
import { getExchanges, updateExchange, deleteExchange } from '../../services/exchange.service'
import { useAuth } from '../../context/AuthContext'

export default function MyExchanges() {
  const { user } = useAuth()
  const [exchanges, setExchanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchExchanges()
  }, [filter])

  async function fetchExchanges() {
    setLoading(true)
    setError(null)
    try {
      const status = filter === 'all' ? null : filter
      const data = await getExchanges(status)
      setExchanges(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error fetching exchanges:', e)
      setError('Failed to load exchanges')
      setExchanges([])
    }
    setLoading(false)
  }

  async function handleStatusChange(exId, newStatus) {
    setUpdating(exId)
    try {
      await updateExchange(exId, newStatus)
      await fetchExchanges()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update exchange')
    } finally {
      setUpdating(null)
    }
  }

  async function handleCancel(exId) {
    if (!window.confirm('Cancel this exchange request?')) return
    setUpdating(exId)
    try {
      await deleteExchange(exId)
      await fetchExchanges()
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to cancel exchange')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-4 text-center py-12">Loading your exchanges...</div>
  }

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-blue-100 text-blue-800',
    REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-green-100 text-green-800'
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Exchanges</h1>

      <div className="mb-6 flex gap-2">
        {['all', 'PENDING', 'ACCEPTED', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {exchanges.length === 0 ? (
        <div className="text-center py-12 bg-white rounded border border-slate-200">
          <p className="text-slate-600">
            {filter === 'all' ? 'No exchange requests' : `No ${filter.toLowerCase()} exchanges`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {exchanges.map(exchange => (
            <div key={exchange.id} className="p-4 bg-white border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-slate-900">{exchange.bookTitle}</h3>
                  <p className="text-sm text-slate-600">by {exchange.bookAuthor}</p>
                  
                  <div className="mt-2 text-sm text-slate-700">
                    {exchange.isRequester ? (
                      <p>
                        <span className="font-semibold">Owner:</span> {exchange.ownerName}
                      </p>
                    ) : (
                      <p>
                        <span className="font-semibold">Requested by:</span> {exchange.requesterName}
                      </p>
                    )}
                  </div>

                  {exchange.notes && (
                    <div className="mt-2 p-2 bg-slate-50 rounded text-sm italic">
                      "{exchange.notes}"
                    </div>
                  )}
                </div>

                <div className="ml-4 text-right">
                  <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${statusColors[exchange.status]}`}>
                    {exchange.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2 flex-wrap">
                {exchange.status === 'PENDING' && exchange.isRequester && (
                  <button
                    onClick={() => handleCancel(exchange.id)}
                    disabled={updating === exchange.id}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {updating === exchange.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}

                {exchange.status === 'PENDING' && !exchange.isRequester && (
                  <>
                    <button
                      onClick={() => handleStatusChange(exchange.id, 'ACCEPTED')}
                      disabled={updating === exchange.id}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {updating === exchange.id ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(exchange.id, 'REJECTED')}
                      disabled={updating === exchange.id}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                {exchange.status === 'ACCEPTED' && !exchange.isRequester && (
                  <button
                    onClick={() => handleStatusChange(exchange.id, 'COMPLETED')}
                    disabled={updating === exchange.id}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating === exchange.id ? 'Processing...' : 'Mark Completed'}
                  </button>
                )}

                {exchange.status === 'COMPLETED' && (
                  <span className="text-xs text-slate-500">
                    Completed on {new Date(exchange.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
