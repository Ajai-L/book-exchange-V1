import React, { useEffect, useState } from 'react'
import { getBooks, deleteBook } from '../../services/admin.service'

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadBooks()
  }, [])

  async function loadBooks() {
    try {
      setLoading(true)
      const data = await getBooks()
      setBooks(data)
    } catch (err) {
      console.error('Failed to load books:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(bookId)
        setBooks(books.filter(b => b.id !== bookId))
        alert('Book deleted successfully')
      } catch (err) {
        alert('Failed to delete book: ' + err.response?.data?.message || err.message)
      }
    }
  }

  if (loading) return <div className="p-4">Loading books...</div>

  const filteredBooks = filterStatus === 'all' 
    ? books 
    : books.filter(b => b.status === filterStatus)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Books Management</h2>
      
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            filterStatus === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          All ({books.length})
        </button>
        <button
          onClick={() => setFilterStatus('Available')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            filterStatus === 'Available' 
              ? 'bg-green-600 text-white' 
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          Available ({books.filter(b => b.status === 'Available').length})
        </button>
        <button
          onClick={() => setFilterStatus('Unavailable')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            filterStatus === 'Unavailable' 
              ? 'bg-orange-600 text-white' 
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          Unavailable ({books.filter(b => b.status === 'Unavailable').length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Condition</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Pending</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{book.title}</td>
                <td className="px-4 py-3">{book.author}</td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p className="font-medium">{book.first_name} {book.last_name}</p>
                    <p className="text-xs text-slate-600">{book.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{book.condition}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    book.status === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {book.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{book.pending_exchanges || 0}</td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {new Date(book.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
