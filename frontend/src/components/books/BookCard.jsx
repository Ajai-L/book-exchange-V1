import React from 'react'
import { Link } from 'react-router-dom'

export default function BookCard({ book }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/book/${book._id}`}>
        <h3 className="font-semibold text-base text-slate-900 hover:text-blue-600">{book.title}</h3>
      </Link>
      <div className="text-sm text-slate-600 mt-1">{book.author}</div>
      {book.category && <div className="text-xs text-slate-500 mt-2">📚 {book.category}</div>}
    </div>
  )
}
