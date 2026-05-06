# Database Setup Guide

## Fresh Database Setup (Complete Reset)

This guide explains how to completely reset and recreate the database from scratch with all features and persistent session support.

### Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed
- Backend dependencies installed (`npm install`)

---

## Step 1: Drop Existing Database

```bash
dropdb -U postgres book_exchange
```

This completely removes the old database and all its data.

---

## Step 2: Recreate Database

```bash
createdb -U postgres book_exchange
```

Creates a fresh, empty database.

---

## Step 3: Run Fresh Setup Script

```bash
cd backend
npm run setup-fresh
```

This script will:
- ✅ Create all tables from scratch
- ✅ Add proper indexes for performance
- ✅ Insert test data (users, books, exchanges)
- ✅ Create sessions table for persistent login

---

## Database Schema

### 1. **users** - User accounts
```
id (PK)
email (UNIQUE)
password_hash
first_name
last_name
role (USER or ADMIN)
city
campus
bio
profile_image
created_at
updated_at
```

### 2. **sessions** - Persistent login sessions ⭐
```
id (PK)
user_id (FK → users)
token (UNIQUE)
expires_at
created_at
last_activity
```
**Purpose:** Stores active sessions so users stay logged in even after server restart.

### 3. **books** - Book listings
```
id (PK)
owner_id (FK → users)
title
author
condition
description
isbn
cover_image
status (Available, Reserved, Exchanged)
created_at
updated_at
```

### 4. **book_images** - Multiple images per book
```
id (PK)
book_id (FK → books)
image_url
display_order
created_at
```

### 5. **exchanges** - Book exchange requests
```
id (PK)
book_id (FK → books)
requester_id (FK → users)
status (PENDING, ACCEPTED, REJECTED, COMPLETED)
notes
created_at
updated_at
```

### 6. **ratings** - User ratings after exchange
```
id (PK)
exchange_id (FK → exchanges)
rater_id (FK → users)
rated_user_id (FK → users)
rating (1-5)
review
created_at
```

---

## Test Accounts

After setup, use these credentials to test:

### Admin Account
```
Email: admin@example.com
Password: admin123
```

### Regular User Accounts
```
Email: john@example.com
Email: jane@example.com
Email: alex@example.com
Password: password123 (for all)
```

---

## Session Persistence

The database now includes a `sessions` table that stores active login tokens. This means:

✅ **Users stay logged in** even if the server restarts  
✅ **Tokens are stored** with expiration times  
✅ **Last activity** is tracked for security  
✅ **Automatic cleanup** of expired sessions (implement in backend)

### How to Use Sessions in Backend

Add this endpoint to check/validate sessions:

```javascript
// Check if session is still valid
router.get('/api/auth/validate-session', async (req, res) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const sessionRes = await query(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (sessionRes.rows.length === 0) {
      return res.status(401).json({ message: 'Session expired' });
    }

    // Update last activity
    await query(
      'UPDATE sessions SET last_activity = NOW() WHERE token = $1',
      [token]
    );

    res.json({ valid: true, session: sessionRes.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
```

---

## Data Included in Fresh Setup

### Users (4 total)
- 1 Admin user
- 3 Regular users with different interests

### Books (6 total)
- Crime and Punishment (John)
- The Bell Jar (John)
- Pride and Prejudice (Jane)
- The Great Gatsby (Jane)
- A Brief History of Time (Alex)
- The Selfish Gene (Alex)

### Exchanges (2 sample)
- Jane requesting Crime and Punishment (PENDING)
- Alex requesting Pride and Prejudice (ACCEPTED)

---

## Indexes for Performance

The setup creates indexes on frequently queried columns:
- `users.email` - Fast user lookup
- `books.owner_id` - Find books by owner
- `books.status` - Filter by availability
- `exchanges.book_id` - Find exchanges for a book
- `exchanges.requester_id` - Find user's requests
- `exchanges.status` - Filter by status
- `sessions.token` - Fast session validation
- `sessions.expires_at` - Find expired sessions

---

## Troubleshooting

### Database already exists error
```bash
dropdb -U postgres book_exchange
createdb -U postgres book_exchange
npm run setup-fresh
```

### Connection refused
Make sure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo service postgresql start
```

### Permission denied
Check your `.env` file has correct credentials:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/book_exchange
```

### Tables not created
Check for SQL errors:
```bash
npm run setup-fresh 2>&1 | grep -i error
```

---

## Next Steps

1. Start the backend server: `npm start`
2. Test login with Postman using test accounts
3. Verify sessions are stored in database
4. Implement session cleanup for expired tokens
5. Add session validation middleware to protected routes

---

## Quick Commands Reference

```bash
# Fresh setup (complete reset)
npm run setup-fresh

# Start server
npm start

# Check database
psql -U postgres -d book_exchange -c "SELECT * FROM users;"

# Drop database
dropdb -U postgres book_exchange

# Recreate database
createdb -U postgres book_exchange
```
