import React, { useEffect, useState } from 'react'
import { getBookImages, deleteBookImage } from '../../services/profile.service'
import { useAuth } from '../../context/AuthContext'

export default function BookImageGallery({ bookId, isOwner = false }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    loadImages()
  }, [bookId])

  async function loadImages() {
    try {
      setLoading(true)
      const data = await getBookImages(bookId)
      setImages(data)
      setSelectedIndex(0)
    } catch (err) {
      console.error('Failed to load images:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteImage(imageId) {
    if (confirm('Delete this image?')) {
      try {
        await deleteBookImage(imageId)
        setImages(images.filter(img => img.id !== imageId))
        if (selectedIndex >= images.length - 1) {
          setSelectedIndex(Math.max(0, images.length - 2))
        }
      } catch (err) {
        alert('Failed to delete image: ' + err.response?.data?.message || err.message)
      }
    }
  }

  if (loading) return <div className="text-center py-8">Loading images...</div>

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>📸 No images yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-slate-100 rounded-lg overflow-hidden">
        <img
          src={images[selectedIndex]?.image_url}
          alt={`Book image ${selectedIndex + 1}`}
          className="w-full h-96 object-cover"
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <div key={img.id} className="relative flex-shrink-0">
            <button
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded overflow-hidden border-2 transition ${
                selectedIndex === idx ? 'border-blue-500' : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              <img
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
            {isOwner && (
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Counter */}
      <div className="text-center text-sm text-slate-600">
        Image {selectedIndex + 1} of {images.length}
      </div>
    </div>
  )
}
