import React, { useState } from 'react'
import { createBook, updateBook } from '../../services/book.service'
import Button from '../common/Button'
import Input from '../common/Input'

export default function BookForm({ book, onSuccess, onCancel }) {
  const [form, setForm] = useState(book || { title: '', author: '', isbn: '', category: '', condition: 'GOOD' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title || !form.author) {
      setError('Title and author are required')
      return
    }
    setSubmitting(true)
    try {
      if (book?._id) {
        await updateBook(book._id, form)
      } else {
        await createBook(form)
      }
      onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save book')
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
      
      <Input
        label="Title *"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      
      <Input
        label="Author *"
        required
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
      />
      
      <Input
        label="ISBN"
        value={form.isbn || ''}
        onChange={(e) => setForm({ ...form, isbn: e.target.value })}
      />
      
      <Input
        label="Category"
        value={form.category || ''}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      
      <div>
        <label className="text-sm block mb-1">Condition</label>
        <select
          value={form.condition || 'GOOD'}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
          className="border border-slate-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="NEW">New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
          <option value="POOR">Poor</option>
        </select>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
        </Button>
        <Button type="button" onClick={onCancel} className="flex-1 bg-slate-400 hover:bg-slate-500">
          Cancel
        </Button>
      </div>
    </form>
  )
}
