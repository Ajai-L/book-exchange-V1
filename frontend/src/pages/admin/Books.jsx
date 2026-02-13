import React, { useEffect, useState } from 'react'
import { getBooks, deleteBook } from '../../services/admin.service'

export default function Books() {
  const [books, setBooks] = useState([])
  useEffect(() => { getBooks().then(setBooks).catch(()=>{}) }, [])
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold">All Books</h2>
      <div className="mt-4 space-y-2">
        {books.map(b => (
          <div key={b._id} className="p-2 border rounded flex items-center justify-between">
            <div>{b.title} — {b.owner?.name}</div>
            <button className="text-red-600" onClick={() => deleteBook(b._id).then(()=>alert('deleted'))}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
