import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBook } from '../../services/book.service'
import { createExchange } from '../../services/exchange.service'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'

export default function BookDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [exchangeModal, setExchangeModal] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchBook()
  }, [id])

  async function fetchBook() {
    try {
      const data = await getBook(id)
      setBook(data)
    } catch (err) {
      setError('Failed to load book')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleRequestExchange() {
    if (!user) {
      navigate('/login')
      return
    }

    if (book.ownerId === user.id) {
      setError('You cannot request your own book')
      return
    }

    setSubmitting(true)
    try {
      await createExchange({ bookId: book.id, notes })
      setExchangeModal(false)
      setNotes('')
      setError(null)
      alert('Exchange request sent! The owner will review it soon.')
      navigate('/my-exchanges')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create exchange request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto p-4 text-center py-12">Loading...</div>
  }

  if (!book) {
    return <div className="max-w-3xl mx-auto p-4 text-center py-12 text-red-600">Book not found</div>
  }

  const isOwner = user && user.id === book.ownerId

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6">
          {book.coverImage ? (
            <div className="w-full sm:w-1/3 flex-shrink-0">
              <img src={book.coverImage} alt={book.title} className="w-full rounded-lg shadow-sm object-cover aspect-[2/3]" />
            </div>
          ) : (
            <div className="w-full sm:w-1/3 flex-shrink-0 bg-slate-100 flex items-center justify-center rounded-lg aspect-[2/3] text-slate-400">
              No Cover
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{book.title}</h1>
            <p className="text-lg text-slate-600 mt-2">by {book.author}</p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {book.status && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  book.status === 'Available' ? 'bg-green-100 text-green-800' :
                  book.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800' :
                  book.status === 'Exchanged' ? 'bg-blue-100 text-blue-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {book.status}
                </span>
              )}
              <span className="px-3 py-1 bg-slate-100 text-slate-800 text-sm font-medium rounded-full">
                {book.condition || 'Good'}
              </span>
            </div>

            {book.isbn && (
              <div className="mt-6 p-3 bg-slate-50 rounded text-slate-600 border border-slate-100">
                <p className="text-sm"><span className="font-semibold text-slate-800">ISBN:</span> {book.isbn}</p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b pb-2">About this book</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {book.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm sticky top-4">
            <h3 className="font-semibold text-lg text-slate-900 mb-4 border-b pb-2">Uploader Information</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl">
                {book.owner?.firstName?.[0] || 'U'}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {book.owner?.firstName} {book.owner?.lastName}
                </p>
                <p className="text-sm text-slate-500 text-xs mt-1">
                  📍 {book.owner?.city || 'Unknown Location'}
                </p>
              </div>
            </div>

            {!isOwner ? (
              <div className="mt-6">
                <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Exchange Flow</h4>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">1</div>
                      <span>Request</span>
                    </div>
                    <div className="h-px bg-slate-300 flex-1 mx-2"></div>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">2</div>
                      <span>Approval</span>
                    </div>
                    <div className="h-px bg-slate-300 flex-1 mx-2"></div>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">3</div>
                      <span>Exchange</span>
                    </div>
                    <div className="h-px bg-slate-300 flex-1 mx-2"></div>
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">4</div>
                      <span>Complete</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">{error}</div>
                )}
                
                <Button 
                  onClick={() => setExchangeModal(true)}
                  disabled={book.status !== 'Available'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {book.status === 'Available' ? 'Request Exchange' : `Book is ${book.status}`}
                </Button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm flex items-center gap-2">
                <span className="text-blue-600 text-lg">ℹ️</span>
                <p className="text-blue-900 font-medium">This is your uploaded book</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exchange Modal */}
      {exchangeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Exchange</h2>
            <p className="text-slate-500 mb-6 text-sm">Send a request to {book.owner?.firstName} to exchange this book.</p>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Message (optional)</label>
              <textarea
                className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="4"
                placeholder="Let them know why you're interested or suggest a place to meet..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg mb-5">{error}</div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setExchangeModal(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestExchange}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
