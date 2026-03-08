import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import * as bookService from '../../services/book.service'

export default function MyBooks() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [user])

  async function fetchBooks() {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const allBooks = await bookService.getBooks();
      const myBooks = allBooks.filter(b => b.ownerId === user.id);
      setBooks(myBooks);
    } catch (e) {
      console.error('Error fetching books:', e)
      setError('Failed to load books')
      setBooks([])
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this book?')) return
    try {
      await bookService.deleteBook(id)
      setBooks(books.filter(b => b.id !== id))
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete book')
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-4 text-center py-12">Loading your books...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Books</h1>
        <Button onClick={() => navigate('/add-book')} className="bg-green-600 hover:bg-green-700">
          + Add Book
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded border border-slate-200">
          <p className="text-slate-600 mb-4">You haven't added any books yet</p>
          <Button onClick={() => navigate('/add-book')}>Add Your First Book</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map(book => (
            <div key={book.id} className="p-4 bg-white border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg text-slate-900">{book.title}</h3>
              <p className="text-sm text-slate-600">{book.author}</p>
              {book.isbn && <p className="text-xs text-slate-500 mt-1">ISBN: {book.isbn}</p>}
              {book.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{book.description}</p>}
              <div className="flex items-center justify-between mt-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  book.isAvailable 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {book.isAvailable ? '✓ Available' : 'Exchanged'}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-1">
                  {book.condition || 'Good'} condition
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => navigate(`/edit-book/${book.id}`)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(book.id)}
                  className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
