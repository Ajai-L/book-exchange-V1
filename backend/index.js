import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const app = express()
const PORT = 5000
const JWT_SECRET = 'your-secret-key-change-in-production'

// Middleware
app.use(cors())
app.use(express.json())

// In-memory storage (replace with database in production)
const users = new Map()
const books = new Map()
const exchanges = new Map()

// Seed some test data - Create test user with proper bcrypt hash
const initializeTestUser = async () => {
  const hashedPassword = await bcryptjs.hash('password123', 10)
  const testUser = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: hashedPassword,
    campus: 'Main',
    city: 'San Francisco',
    role: 'USER'
  }
  users.set('john@example.com', testUser)
}

// Utility Functions
function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Middleware to extract user from token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  req.user = decoded
  next()
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, campus, city, role } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (users.has(email)) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)
    const id = `user-${Date.now()}`

    const user = {
      id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      campus: campus || '',
      city: city || '',
      role: role || 'USER'
    }

    users.set(email, user)

    const token = generateToken(user)
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user.id, firstName, lastName, email, role: user.role }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const user = users.get(email)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const passwordMatch = await bcryptjs.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user)
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
})

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = Array.from(users.values()).find(u => u.id === req.user.sub)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  })
})

// Book Routes (Stub)
app.get('/api/books', (req, res) => {
  res.json({
    books: Array.from(books.values())
  })
})

app.post('/api/books', authenticateToken, (req, res) => {
  const { title, author, isbn, condition } = req.body
  const id = `book-${Date.now()}`
  const book = { id, title, author, isbn, condition, ownerId: req.user.sub, createdAt: new Date() }
  books.set(id, book)
  res.status(201).json(book)
})

// User Profile Routes (Stub)
app.get('/api/users/:id', authenticateToken, (req, res) => {
  const user = Array.from(users.values()).find(u => u.id === req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    campus: user.campus,
    city: user.city,
    role: user.role
  })
})

app.put('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.sub !== req.params.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const user = Array.from(users.values()).find(u => u.id === req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const { firstName, lastName, campus, city } = req.body
  if (firstName) user.firstName = firstName
  if (lastName) user.lastName = lastName
  if (campus !== undefined) user.campus = campus
  if (city !== undefined) user.city = city

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    campus: user.campus,
    city: user.city,
    role: user.role
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Start server
app.listen(PORT, async () => {
  await initializeTestUser()
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('\n📚 Test Credentials:')
  console.log('Email: john@example.com')
  console.log('Password: password123')
})
