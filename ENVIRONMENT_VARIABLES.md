# Environment Variables Reference

Complete list of all environment variables needed for development and production.

---

## 🔧 Backend Environment Variables

### Location
- **Development:** `backend/.env`
- **Production:** Set in Render dashboard

### Required Variables

#### `DATABASE_URL` (Required)
- **Type:** String
- **Description:** PostgreSQL connection string
- **Development:** `postgresql://postgres:postgres@localhost:5432/book_exchange`
- **Production:** `postgresql://user:password@host.neon.tech/database_name`
- **Example:** `postgresql://neon_user:abc123@ep-cool-lake-123456.neon.tech/book_exchange`

#### `JWT_SECRET` (Required)
- **Type:** String
- **Description:** Secret key for signing JWT tokens (min 32 characters)
- **Development:** `super_secret_key_change_in_production`
- **Production:** Generate strong random string
- **Example:** `aB3$xY9@mK2#pL8&qR5!vW1^zT4%uI6*jN7(sO0)dF4-eG5+hH6=iJ7[kL8]`
- **How to Generate:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

#### `NODE_ENV` (Required)
- **Type:** String
- **Description:** Environment mode
- **Development:** `development`
- **Production:** `production`
- **Values:** `development` | `production`

#### `PORT` (Optional)
- **Type:** Number
- **Description:** Server port
- **Development:** `5000`
- **Production:** `5000` (Render may override)
- **Default:** `5000`

#### `CORS_ORIGIN` (Required)
- **Type:** String
- **Description:** Allowed frontend origin for CORS
- **Development:** `http://localhost:5173`
- **Production:** `https://your-frontend.vercel.app`
- **Example:** `https://book-exchange.vercel.app`

---

## 🎨 Frontend Environment Variables

### Location
- **Development:** `frontend/.env.local` (optional, uses proxy)
- **Production:** Set in Vercel dashboard

### Required Variables

#### `VITE_API_URL` (Optional in dev, Required in prod)
- **Type:** String
- **Description:** Backend API URL
- **Development:** Not needed (uses `/api` proxy)
- **Production:** Backend URL on Render
- **Example:** `https://book-exchange-backend.onrender.com`
- **Note:** Must start with `VITE_` to be exposed to client

---

## 📊 Complete Environment Variables Table

### Backend

| Variable | Required | Dev Value | Prod Value | Type |
|----------|----------|-----------|-----------|------|
| `DATABASE_URL` | ✅ Yes | `postgresql://postgres:postgres@localhost:5432/book_exchange` | Neon URL | String |
| `JWT_SECRET` | ✅ Yes | `super_secret_key_change_in_production` | Random 32+ chars | String |
| `NODE_ENV` | ✅ Yes | `development` | `production` | String |
| `PORT` | ❌ No | `5000` | `5000` | Number |
| `CORS_ORIGIN` | ✅ Yes | `http://localhost:5173` | Vercel URL | String |

### Frontend

| Variable | Required | Dev Value | Prod Value | Type |
|----------|----------|-----------|-----------|------|
| `VITE_API_URL` | ❌ No | (uses proxy) | Render URL | String |

---

## 🚀 Deployment Environment Variables

### Render (Backend)

Set these in Render dashboard → Environment:

```
DATABASE_URL=postgresql://user:password@host.neon.tech/database_name
JWT_SECRET=aB3$xY9@mK2#pL8&qR5!vW1^zT4%uI6*jN7(sO0)dF4-eG5+hH6=iJ7[kL8]
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://book-exchange.vercel.app
```

### Vercel (Frontend)

Set these in Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://book-exchange-backend.onrender.com
```

---

## 🔐 Security Best Practices

### JWT_SECRET
- ✅ Use strong random string (32+ characters)
- ✅ Include uppercase, lowercase, numbers, symbols
- ✅ Never commit to GitHub
- ✅ Rotate periodically in production
- ❌ Don't use simple passwords
- ❌ Don't share in messages/emails

### DATABASE_URL
- ✅ Use Neon PostgreSQL (managed service)
- ✅ Enable SSL/TLS connection
- ✅ Use strong database password
- ✅ Restrict IP access if possible
- ❌ Never commit to GitHub
- ❌ Don't use local database in production

### CORS_ORIGIN
- ✅ Set to exact frontend URL
- ✅ Use HTTPS in production
- ❌ Don't use `*` (allow all) in production
- ❌ Don't include trailing slash

---

## 🧪 Testing Environment Variables

### Backend
```bash
# Test database connection
node -e "require('dotenv').config(); const { query } = require('./db/pool'); query('SELECT 1').then(() => console.log('✅ DB connected')).catch(e => console.error('❌ DB error:', e.message))"

# Test JWT secret
node -e "require('dotenv').config(); console.log('JWT_SECRET length:', process.env.JWT_SECRET.length)"
```

### Frontend
```bash
# Check environment variables are loaded
npm run dev
# Open browser console and check: import.meta.env.VITE_API_URL
```

---

## 📝 .env File Examples

### Backend Development (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/book_exchange
JWT_SECRET=super_secret_key_change_in_production
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Backend Production (Render)
```
DATABASE_URL=postgresql://neon_user:abc123@ep-cool-lake-123456.neon.tech/book_exchange
JWT_SECRET=aB3$xY9@mK2#pL8&qR5!vW1^zT4%uI6*jN7(sO0)dF4-eG5+hH6=iJ7[kL8]
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://book-exchange.vercel.app
```

### Frontend Development (.env.local)
```
VITE_API_URL=http://localhost:5000
```

### Frontend Production (Vercel)
```
VITE_API_URL=https://book-exchange-backend.onrender.com
```

---

## 🔄 Environment Variable Flow

```
Development:
┌─────────────────────────────────────────┐
│ Frontend (Vercel)                       │
│ http://localhost:5173                   │
│ Uses /api proxy → localhost:5000        │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│ Backend (Local)                         │
│ http://localhost:5000                   │
│ DATABASE_URL=localhost:5432             │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│ Database (Local PostgreSQL)             │
│ localhost:5432                          │
└─────────────────────────────────────────┘

Production:
┌─────────────────────────────────────────┐
│ Frontend (Vercel)                       │
│ https://book-exchange.vercel.app        │
│ VITE_API_URL=https://backend.onrender   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│ Backend (Render)                        │
│ https://book-exchange-backend.onrender  │
│ DATABASE_URL=neon.tech                  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│ Database (Neon PostgreSQL)              │
│ host.neon.tech                          │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist

### Before Deployment
- [ ] All required variables are set
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] DATABASE_URL points to Neon
- [ ] CORS_ORIGIN is correct
- [ ] .env files are in .gitignore
- [ ] No credentials in GitHub

### After Deployment
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Login works with test account
- [ ] Database queries work
- [ ] CORS errors don't appear
- [ ] API calls succeed

---

## 🆘 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
cd backend
npm install dotenv
```

### "CORS error" in browser
- Check CORS_ORIGIN in backend matches frontend URL
- Restart backend after changing CORS_ORIGIN

### "Database connection failed"
- Verify DATABASE_URL is correct
- Check Neon IP whitelist
- Test connection locally first

### "JWT verification failed"
- Ensure JWT_SECRET is same in dev and prod
- Check token hasn't expired
- Clear browser localStorage and re-login

### "VITE_API_URL not working"
- Must start with `VITE_` prefix
- Restart frontend dev server after changing
- Check browser console for actual URL being used
