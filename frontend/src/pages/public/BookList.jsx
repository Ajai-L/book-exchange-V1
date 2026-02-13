import React, { useEffect, useState } from 'react'
import { getBooks } from '../../services/book.service'
import BookCard from '../../components/books/BookCard'

export default function BookList() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    setLoading(true)
    setError(null)
    try {
      const data = await getBooks({ q })
      setBooks(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error fetching books:', e)
      setError('Failed to load books')
      setBooks([])
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Books</h1>
      <div className="mb-6">
        <input 
          className="border border-slate-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Search by title or author" 
          value={q} 
          onChange={(e)=>setQ(e.target.value)} 
        />
      </div>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-8">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          {q ? 'No books found matching your search.' : 'No books available yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map(b => <BookCard key={b._id} book={b} />)}
        </div>
      )}
    </div>
  )
}
