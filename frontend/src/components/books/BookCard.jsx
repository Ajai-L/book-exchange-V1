import React from 'react'
import { Link } from 'react-router-dom'

export default function BookCard({ book }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <Link to={`/book/${book.id}`} className="flex-grow">
        <h3 className="font-semibold text-base text-slate-900 hover:text-blue-600 line-clamp-2">{book.title}</h3>
      </Link>
      <div className="text-sm text-slate-600 mt-1 line-clamp-1">{book.author}</div>
      <div className="text-xs text-slate-500 mt-2">
        <span className="inline-block bg-slate-100 px-2 py-1 rounded">{book.condition || 'Good'}</span>
      </div>
      <div className="text-xs text-slate-500 mt-2">
        📍 {book.ownerCity || 'Unknown'} • 👤 {book.ownerName || 'User'}
      </div>
      {book.description && <p className="text-xs text-slate-600 mt-2 line-clamp-2">{book.description}</p>}
    </div>
  )
}
