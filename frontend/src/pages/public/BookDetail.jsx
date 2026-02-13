import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBook } from '../../services/book.service'

export default function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBook(id).then(b => { setBook(b); setLoading(false) }).catch(()=>setLoading(false))
  }, [id])

  if (loading) return <div className="p-4">Loading...</div>
  if (!book) return <div className="p-4">Book not found</div>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold">{book.title}</h1>
      <p className="text-sm text-slate-600">{book.author}</p>
      <div className="mt-4">{book.description}</div>
    </div>
  )
}
