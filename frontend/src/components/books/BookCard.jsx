import React from 'react'
import { Link } from 'react-router-dom'

export default function BookCard({ book }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <Link to={`/book/${book.id}`} className="block h-48 w-full bg-slate-100 relative overflow-hidden group">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">No Cover</div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-semibold text-base text-slate-900 hover:text-blue-600 line-clamp-1">{book.title}</h3>
        </Link>
        <div className="text-sm text-slate-600 mt-1 line-clamp-1">{book.author}</div>
        
        <div className="flex gap-2 mt-2">
          {book.status && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              book.status === 'Available' ? 'bg-green-100 text-green-700' :
              book.status === 'Reserved' ? 'bg-yellow-100 text-yellow-700' :
              book.status === 'Exchanged' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {book.status}
            </span>
          )}
          <span className="text-xs inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
            {book.condition || 'Good'}
          </span>
        </div>

        <div className="text-xs text-slate-500 mt-3 flex items-center gap-1">
          <span>👤 {book.owner?.firstName || 'User'}</span>
        </div>
        
        {book.description && (
          <div className="mt-3 relative flex-grow">
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{book.description}</p>
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>
    </div>
  )
}
