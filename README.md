# OpenShelf - Book Exchange Platform

A lean MVP for exchanging books within a community.

## Quick Start

### Prerequisites
- Node.js v18+ 
- npm

### Setup & Run

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

## Test Credentials

```
Email: john@example.com
Password: password123
```

Or create a new account via the Register page.

## Features

### Unauthenticated (Public)
- Browse available books
- View "How It Works"
- Login / Register

### Authenticated (User)
- **Add Book** - List your books
- **My Listings** - Manage your inventory
- **My Requests** - Track exchanges
- **Profile** - View/edit profile, logout

### Admin (Optional)
- Dashboard
- User management
- Book management
- Reports

## Architecture

### Frontend
- **React 18** + **Vite**
- **React Router** v6 for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **localStorage** for auth persistence

### Backend (Node.js/Express)
- JWT-based authentication
- In-memory storage (swap for database)
- RESTful API
- CORS enabled

## Key Files

**Frontend:**
- `src/context/AuthContext.jsx` - Auth state & localStorage
- `src/components/layout/Navbar.jsx` - MVP navigation
- `src/services/auth.service.js` - Login/Register API calls
- `src/services/api.js` - API interceptors (auto-adds token)

**Backend:**
- `backend/index.js` - Server + auth endpoints

## localStorage Details

Auth token is automatically saved to `localStorage` under the key `token`. It's automatically attached to all API requests and restored on app reload.

To clear auth state:
1. Logout button in navbar
2. Or manually: `localStorage.removeItem('token')`

## Next Steps
- Replace in-memory storage with a real database
- Add book management endpoints
- Implement exchange request system
- Add real notification system
