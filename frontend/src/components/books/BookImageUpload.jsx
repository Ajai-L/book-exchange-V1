import React, { useState } from 'react'
import { addBookImage } from '../../services/profile.service'

export default function BookImageUpload({ bookId, onImageAdded, maxImages = 5 }) {
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(e) {
    e.preventDefault()
    setError('')

    if (!imageUrl.trim()) {
      setError('Please enter an image URL')
      return
    }

    // Basic URL validation
    try {
      new URL(imageUrl)
    } catch {
      setError('Please enter a valid image URL')
      return
    }

    try {
      setUploading(true)
      const newImage = await addBookImage(bookId, imageUrl.trim())
      setImageUrl('')
      onImageAdded(newImage)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-bold mb-3">📸 Add Book Image</h3>
      <form onSubmit={handleUpload} className="space-y-3">
        <div>
          <label className="text-sm font-medium">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border rounded text-sm"
          />
          <p className="text-xs text-slate-600 mt-1">Paste the direct URL to your book image</p>
        </div>

        {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 rounded font-medium text-sm"
        >
          {uploading ? 'Uploading...' : 'Add Image'}
        </button>
      </form>

      <p className="text-xs text-slate-600 mt-4">
        <strong>💡 Tips:</strong><br/>
        • Use external image hosting (imgur, imgbb, etc.)<br/>
        • Recommended size: 300x400px<br/>
        • Supported: JPG, PNG, WebP
      </p>
    </div>
  )
}
