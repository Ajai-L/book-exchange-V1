import React, { useEffect, useState } from 'react'
import { getMyExchanges } from '../../services/exchange.service'

export default function MyExchanges() {
  const [exchanges, setExchanges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyExchanges()
      .then(setExchanges)
      .catch((e) => {
        console.error('Error fetching exchanges:', e)
        setExchanges([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="max-w-4xl mx-auto p-4">Loading your exchanges...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Exchanges</h1>
      {exchanges.length === 0 ? (
        <div className="text-center py-8 bg-white rounded border border-slate-200">
          <p className="text-slate-600">No exchange requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exchanges.map(e => (
            <div key={e._id} className="p-4 bg-white border border-slate-200 rounded shadow-sm">
              <h3 className="font-semibold text-lg">{e.book?.title}</h3>
              <p className="text-sm text-slate-600">{e.book?.author}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`px-3 py-1 rounded text-sm text-white ${
                  e.status === 'PENDING' ? 'bg-yellow-600' :
                  e.status === 'ACCEPTED' ? 'bg-green-600' :
                  e.status === 'COMPLETED' ? 'bg-blue-600' : 'bg-slate-600'
                }`}>
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
