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

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-6">
            <Link to="/books" className="font-bold text-lg text-blue-600">OpenShelf</Link>
            <nav className="flex items-center gap-6">
              <Link to="/books" className="text-sm text-slate-700 hover:text-blue-600">Browse</Link>
              {!user && (
                <Link to="/how-it-works" className="text-sm text-slate-700 hover:text-blue-600">How It Works</Link>
              )}
              {user && (
                <Link to="/add-book" className="text-sm font-semibold text-blue-600 hover:text-blue-700">+ Add Book</Link>
              )}
            </nav>
          </div>

          {/* Right Section */}
          <nav className="flex items-center gap-4">
            {loading ? (
              <span className="text-sm text-slate-500">Loading...</span>
            ) : user ? (
              <>
                <Link to="/my-books" className="text-sm text-slate-700 hover:text-blue-600">My Listings</Link>
                <Link to="/my-exchanges" className="text-sm text-slate-700 hover:text-blue-600">My Requests</Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="text-sm text-slate-700 hover:text-blue-600 flex items-center gap-1"
                  >
                    {user.name}
                    <span className="text-xs">▼</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        View Profile
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 border-t border-slate-200"
                        onClick={() => setProfileOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 border-t border-slate-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-blue-600 hover:underline">Login</Link>
                <Link to="/register" className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Register</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
