import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import * as bookService from '../../services/book.service'

export default function AddBook() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    condition: 'good',
    description: ''
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.title || !form.author) {
      setError('Title and author are required')
      return
    }

    setSubmitting(true)
    try {
      await bookService.createBook(form)
      navigate('/my-books')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add book')
    }
    setSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded shadow-sm">
        <h1 className="text-2xl font-bold mb-6">List a Book</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Book Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Input
            label="Author"
            required
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />

          <Input
            label="ISBN (Optional)"
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          />

          <div>
            <label className="text-sm block mb-1">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="border border-slate-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">Description (Optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-slate-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Add any additional details about the book..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={submitting} className="flex-1 justify-center">
              {submitting ? 'Listing...' : 'List Book'}
            </Button>
            <button
              type="button"
              onClick={() => navigate('/my-books')}
              className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
