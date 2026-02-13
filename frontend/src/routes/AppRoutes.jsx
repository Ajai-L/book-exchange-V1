import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import HowItWorks from '../pages/public/HowItWorks'
import BookList from '../pages/public/BookList'
import BookDetail from '../pages/public/BookDetail'
import AddBook from '../pages/user/AddBook'
import Profile from '../pages/user/Profile'
import MyBooks from '../pages/user/MyBooks'
import MyExchanges from '../pages/user/MyExchanges'
import Dashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import Books from '../pages/admin/Books'
import Reports from '../pages/admin/Reports'
import RequireAuth from './RequireAuth'
import RequireAdmin from './RequireAdmin'
import Navbar from '../components/layout/Navbar'

export default function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route element={<RequireAuth />}>
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-books" element={<MyBooks />} />
          <Route path="/my-exchanges" element={<MyExchanges />} />
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/books" element={<Books />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Route>
      </Routes>
    </div>
  )
}
