# OpenSelf - Book Exchange Platform

A modern, full-featured book exchange platform for communities to connect and exchange books seamlessly.

## 🎯 Features

### For All Users
- **Browse Books** - Discover available books in your community
- **Search & Filter** - Find books by title or author
- **Book Details** - View detailed information about books including condition and owner contact

### For Authenticated Users
- **List Books** - Add your books to the exchange platform with title, author, ISBN, condition, and description
- **Manage Books** - Edit and delete your book listings
- **Request Exchanges** - Request books from other users with optional messages
- **Track Exchanges** - Monitor all your active and completed exchanges
- **Edit Profile** - Manage your profile information and location details

### For Admins
- **Admin Dashboard** - View platform statistics and manage content
- **User Management** - Monitor all registered users
- **Book Management** - Oversee all book listings
- **Exchange Reports** - Track all exchanges on the platform

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** v12 or higher

## 🚀 Quick Start

### 1. Database Setup

**Install PostgreSQL:**
- **macOS:** `brew install postgresql@15`
- **Ubuntu/Debian:** `sudo apt-get install postgresql postgresql-contrib`
- **Windows:** Download from [postgresql.org](https://www.postgresql.org/download/)

**Start PostgreSQL:**

```bash
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo service postgresql start

# Windows - Already started if installed as service
```

### 2. Initialize Backend Database

```bash
cd backend
npm install
npm run setup-db
```

This will:
- Create the `book_exchange` database
- Create all necessary tables (users, books, exchanges)
- Insert test data with sample books

### 3. Start Backend Server

```bash
# Terminal 1 - From backend directory
npm start
```

Server runs on `http://localhost:5000`

### 4. Start Frontend Development Server

```bash
# Terminal 2 - From frontend directory
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔐 Test Accounts

### Regular User
```
Email: john@example.com
Password: password123
```

### Administrator
```
Email: admin@example.com
Password: password123
```

**Note:** You can also create new accounts via the Register page

## 🔄 Multiple Accounts & Exchange System

### How It Works
- The platform supports unlimited accounts
- Each account is independent with its own books and exchanges
- Users can login/logout between accounts
- Exchanges are fully tracked between stored accounts

### Exchange Workflow

1. **User A Lists Books** - User A signs up/logs in and adds books
2. **User B Searches** - User B browses available books
3. **User B Requests** - User B sends exchange request with optional note
4. **User A Reviews** - User A sees pending requests in their dashboard
5. **User A Accepts/Rejects** - Sets exchange status
6. **User A Completes** - Marks as complete after physical exchange
7. **Status Updates** - Book becomes unavailable after completion

### Exchange Statuses
- **PENDING** - Awaiting owner response
- **ACCEPTED** - Owner accepted
- **REJECTED** - Owner rejected
- **COMPLETED** - Exchange finished

## 📁 Project Structure

```
book-exchange/
├── backend/
│   ├── db/
│   │   ├── pool.js              # PostgreSQL connection
│   │   └── setup.js             # Database initialization
│   ├── index.js                 # Express server & routes
│   ├── package.json
│   ├── .env                     # Environment config
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── context/             # React Context (Auth)
│   │   ├── pages/               # Route pages
│   │   ├── services/            # API services
│   │   └── main.jsx             # Entry point
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Books
- `GET /api/books` - List available books
- `GET /api/books/:id` - Book details
- `POST /api/books` - Add book (auth)
- `PUT /api/books/:id` - Edit book (owner only)
- `DELETE /api/books/:id` - Delete book (owner only)

### Exchanges
- `GET /api/exchanges` - User's exchanges (auth)
- `POST /api/exchanges` - Request exchange (auth)
- `PUT /api/exchanges/:id` - Update status (owner only)
- `DELETE /api/exchanges/:id` - Cancel request (auth)

### Users
- `GET /api/users/:id` - User profile
- `PUT /api/users/:id` - Update profile (auth)

### Admin
- `GET /api/admin/users` - List users (admin)
- `GET /api/admin/exchanges` - All exchanges (admin)
- `GET /api/admin/stats` - Statistics (admin)

## 🛠 Technology Stack

**Backend:**
- Express.js, PostgreSQL, JWT, bcryptjs

**Frontend:**
- React 18, React Router, Axios, Tailwind CSS, Vite

## 🐛 Troubleshooting

### PostgreSQL Issues
```bash
# Check if running
psql --version

# Connect
psql -U postgres -h localhost

# Check database
psql -U postgres -h localhost -l | grep book_exchange
```

### Port in Use
```bash
# Backend (find and kill)
lsof -i :5000
kill -9 <PID>

# Frontend - Vite auto-selects next port
```

### Database Errors
```bash
# Recreate database
dropdb -U postgres book_exchange
createdb -U postgres book_exchange
npm run setup-db
```

## 🚀 Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Production Environment
```env
DATABASE_URL=postgresql://user:pass@host/book_exchange
JWT_SECRET=your-secure-secret-min-32-chars
NODE_ENV=production
PORT=5000
```

## 📝 License

Open source - available for community use and modification.
