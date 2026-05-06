import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUserProfile, rateUser } from '../../services/profile.service'
import { useAuth } from '../../context/AuthContext'

export default function UserProfile() {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ratingForm, setRatingForm] = useState({ exchangeId: '', rating: 5, review: '' })
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [userId])

  async function loadProfile() {
    try {
      setLoading(true)
      const data = await getUserProfile(userId)
      setProfile(data)
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleRateSubmit(e) {
    e.preventDefault()
    if (!ratingForm.exchangeId) {
      alert('Please select an exchange')
      return
    }
    try {
      setSubmittingRating(true)
      await rateUser(userId, ratingForm.exchangeId, ratingForm.rating, ratingForm.review)
      alert('Rating submitted successfully')
      setRatingForm({ exchangeId: '', rating: 5, review: '' })
      loadProfile()
    } catch (err) {
      alert('Failed to submit rating: ' + err.response?.data?.message || err.message)
    } finally {
      setSubmittingRating(false)
    }
  }

  if (loading) return <div className="p-4">Loading profile...</div>
  if (!profile) return <div className="p-4 text-red-600">Profile not found</div>

  const { user, books, exchanges, ratings, stats } = profile

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
            {user.first_name[0]}{user.last_name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.first_name} {user.last_name}</h1>
            <p className="text-slate-600 text-sm">{user.email}</p>
            {user.city && <p className="text-slate-600 text-sm">📍 {user.city}{user.campus ? `, ${user.campus}` : ''}</p>}
            <p className="text-slate-600 text-sm">📅 Joined {new Date(user.created_at).toLocaleDateString()}</p>
            {user.bio && <p className="text-slate-700 mt-2">{user.bio}</p>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm font-medium">Books Listed</p>
          <p className="text-2xl font-bold text-blue-900">{stats.totalBooks}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm font-medium">Exchanges</p>
          <p className="text-2xl font-bold text-green-900">{stats.totalExchanges}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-emerald-700 text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold text-emerald-900">{stats.completedExchanges}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 text-sm font-medium">Avg Rating</p>
          <p className="text-2xl font-bold text-yellow-900">⭐ {stats.averageRating}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-700 text-sm font-medium">Ratings</p>
          <p className="text-2xl font-bold text-purple-900">{stats.totalRatings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Books Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">📚 Books Listed ({books.length})</h2>
            {books.length === 0 ? (
              <p className="text-slate-600">No books listed yet</p>
            ) : (
              <div className="space-y-3">
                {books.map(book => (
                  <div key={book.id} className="p-3 border rounded hover:bg-slate-50">
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-slate-600">{book.author}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded">{book.condition}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        book.status === 'Available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {book.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exchange History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">🔄 Recent Exchanges ({exchanges.length})</h2>
            {exchanges.length === 0 ? (
              <p className="text-slate-600">No exchanges yet</p>
            ) : (
              <div className="space-y-3">
                {exchanges.slice(0, 10).map(ex => (
                  <div key={ex.id} className="p-3 border rounded hover:bg-slate-50">
                    <p className="font-medium">{ex.title}</p>
                    <p className="text-sm text-slate-600">with {ex.first_name} {ex.last_name}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        ex.status === 'COMPLETED' ? 'bg-green-100 text-green-700'
                        : ex.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700'
                        : ex.status === 'ACCEPTED' ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {ex.status}
                      </span>
                      <span className="text-xs text-slate-600">{new Date(ex.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ratings Sidebar */}
        <div>
          {/* Ratings */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">⭐ Ratings ({ratings.length})</h2>
            {ratings.length === 0 ? (
              <p className="text-slate-600 text-sm">No ratings yet</p>
            ) : (
              <div className="space-y-3">
                {ratings.map(rating => (
                  <div key={rating.id} className="p-3 border rounded bg-slate-50">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{rating.first_name} {rating.last_name}</p>
                      <span className="text-yellow-500">{'⭐'.repeat(rating.rating)}</span>
                    </div>
                    {rating.review && <p className="text-xs text-slate-600 mt-2">{rating.review}</p>}
                    <p className="text-xs text-slate-500 mt-1">{new Date(rating.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Rating */}
          {currentUser && currentUser.id !== parseInt(userId) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-3">Rate this user</h3>
              <form onSubmit={handleRateSubmit} className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Exchange (select completed)</label>
                  <select
                    value={ratingForm.exchangeId}
                    onChange={(e) => setRatingForm({ ...ratingForm, exchangeId: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    <option value="">Select exchange</option>
                    {exchanges
                      .filter(ex => ex.status === 'COMPLETED')
                      .map(ex => (
                        <option key={ex.id} value={ex.id}>
                          {ex.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <select
                    value={ratingForm.rating}
                    onChange={(e) => setRatingForm({ ...ratingForm, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ Good</option>
                    <option value={3}>⭐⭐⭐ Average</option>
                    <option value={2}>⭐⭐ Poor</option>
                    <option value={1}>⭐ Very Poor</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Review (optional)</label>
                  <textarea
                    value={ratingForm.review}
                    onChange={(e) => setRatingForm({ ...ratingForm, review: e.target.value })}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 border rounded text-sm"
                    rows="3"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 rounded font-medium text-sm"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
