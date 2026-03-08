import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setProfileOpen(false)
    logout()
    navigate('/books')
  }

  const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : ''

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-8">
            <Link to="/books" className="font-['F1_Regular',sans-serif] font-bold text-2xl text-blue-600 hover:text-blue-700">
              OpenSelf
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/books" className="text-sm text-slate-700 hover:text-blue-600 transition">
                Browse Books
              </Link>
              {!user && (
                <Link to="/how-it-works" className="text-sm text-slate-700 hover:text-blue-600 transition">
                  How It Works
                </Link>
              )}
              {user && (
                <Link to="/add-book" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
                  + Add Book
                </Link>
              )}
            </nav>
          </div>

          {/* Right Section */}
          <nav className="flex items-center gap-4">
            {loading ? (
              <span className="text-sm text-slate-500">Loading...</span>
            ) : user ? (
              <>
                <Link to="/my-books" className="hidden sm:inline text-sm text-slate-700 hover:text-blue-600 transition">
                  My Books
                </Link>
                <Link to="/my-exchanges" className="hidden sm:inline text-sm text-slate-700 hover:text-blue-600 transition">
                  My Exchanges
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="text-sm text-slate-700 hover:text-blue-600 flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-50 transition"
                  >
                    <span>👤</span>
                    <span className="hidden sm:inline">{displayName}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded shadow-lg z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        to="/my-books"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 border-t border-slate-200 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        📚 My Books
                      </Link>
                      <Link
                        to="/my-exchanges"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 border-t border-slate-200 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        🔄 My Exchanges
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          📊 Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200 transition"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700 transition">
                  Login
                </Link>
                <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

