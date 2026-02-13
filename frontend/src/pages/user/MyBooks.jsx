import React, { useEffect, useState } from 'react'
import { getBooks, deleteBook } from '../../services/book.service'
import { useAuth } from '../../context/AuthContext'
import BookForm from '../../components/books/BookForm'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'

export default function MyBooks() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    setLoading(true)
    try {
      const data = await getBooks({ owner: user?.id })
      setBooks(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error fetching books:', e)
      setBooks([])
    }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this book?')) return
    setDeleting(id)
    try {
      await deleteBook(id)
      setBooks(books.filter(b => b._id !== id))
    } catch (e) {
      alert('Failed to delete book')
    }
    setDeleting(null)
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditingBook(null)
    fetchBooks()
  }

  if (loading) return <div className="max-w-4xl mx-auto p-4">Loading your books...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Books</h1>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">+ Add Book</Button>
      </div>

      {showForm && (
        <Modal title={editingBook ? 'Edit Book' : 'Add New Book'}>
          <BookForm 
            book={editingBook} 
            onSuccess={handleFormSuccess}
            onCancel={() => { setShowForm(false); setEditingBook(null) }}
          />
        </Modal>
      )}

      {books.length === 0 ? (
        <div className="text-center py-8 bg-white rounded border border-slate-200">
          <p className="text-slate-600 mb-4">You haven't added any books yet</p>
          <Button onClick={() => setShowForm(true)}>Add Your First Book</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map(book => (
            <div key={book._id} className="p-4 bg-white border border-slate-200 rounded shadow-sm">
              <h3 className="font-semibold text-lg text-slate-900">{book.title}</h3>
              <p className="text-sm text-slate-600">{book.author}</p>
              {book.isbn && <p className="text-xs text-slate-500 mt-1">ISBN: {book.isbn}</p>}
              {book.category && <p className="text-xs text-slate-500">📚 {book.category}</p>}
              <p className="text-xs mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded inline-block">
                {book.condition || 'GOOD'} condition
              </p>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => { setEditingBook(book); setShowForm(true) }}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(book._id)}
                  disabled={deleting === book._id}
                  className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting === book._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
