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
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-slate-900">{book.title}</h1>
          <p className="text-lg text-slate-600 mt-2">by {book.author}</p>
          
          {book.isbn && (
            <div className="mt-4 p-3 bg-slate-50 rounded">
              <p className="text-sm"><span className="font-semibold">ISBN:</span> {book.isbn}</p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">About this book</h2>
            <p className="text-slate-700 leading-relaxed">
              {book.description || 'No description provided.'}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded">
              <p className="text-xs text-slate-600 uppercase tracking-wide">Condition</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{book.condition}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <p className="text-xs text-slate-600 uppercase tracking-wide">Listed</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {new Date(book.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="p-4 bg-white border border-slate-200 rounded-lg sticky top-4">
            <h3 className="font-semibold text-slate-900 mb-4">Owner Information</h3>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600">Name</p>
              <p className="font-semibold text-slate-900">
                {book.owner.firstName} {book.owner.lastName}
              </p>
            </div>

            <div className="mb-4 pb-4 border-b border-slate-200">
              <p className="text-sm text-slate-600">Location</p>
              <p className="font-semibold text-slate-900">{book.owner.city}</p>
              {book.owner.campus && <p className="text-sm text-slate-600">{book.owner.campus}</p>}
            </div>

            {!isOwner && (
              <>
                {error && (
                  <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
                )}
                <Button 
                  onClick={() => setExchangeModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Request Exchange
                </Button>
              </>
            )}

            {isOwner && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="text-blue-900">This is your book</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exchange Modal */}
      {exchangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Request Exchange</h2>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Add a message for the owner (optional)</p>
              <textarea
                className="w-full border border-slate-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Let them know why you're interested..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setExchangeModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestExchange}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
