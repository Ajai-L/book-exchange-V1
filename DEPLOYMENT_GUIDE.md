# Deployment Guide - Book Exchange Platform

Deploy Frontend on Vercel, Backend on Render, Database on Neon PostgreSQL.

---

## 📋 Environment Variables Summary

### Backend (Render)
```
DATABASE_URL=postgresql://user:password@host.neon.tech/database_name
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🗄️ Step 1: Setup Database on Neon

### 1.1 Create Neon Account
- Go to https://neon.tech
- Sign up with GitHub
- Create a new project

### 1.2 Get Connection String
- In Neon dashboard, copy the connection string
- Format: `postgresql://user:password@host.neon.tech/database_name`
- Save this for later

### 1.3 Create Database Tables
```bash
# Connect to Neon database
psql "postgresql://user:password@host.neon.tech/database_name"

# Run setup script (copy the SQL from backend/db/setup-fresh.js)
# Or use the setup script:
cd backend
DATABASE_URL="postgresql://user:password@host.neon.tech/database_name" npm run setup-fresh
```

---

## 🚀 Step 2: Deploy Backend on Render

### 2.1 Create Render Account
- Go to https://render.com
- Sign up with GitHub

### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the `book-exchange-V1` repository
4. Configure:
   - **Name:** `book-exchange-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid if needed)

### 2.3 Add Environment Variables
In Render dashboard, go to Environment:

```
DATABASE_URL=postgresql://user:password@host.neon.tech/database_name
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

### 2.4 Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Copy the backend URL (e.g., `https://book-exchange-backend.onrender.com`)

---

## 🎨 Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Select your GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.3 Add Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:

```
VITE_API_URL=https://book-exchange-backend.onrender.com
```

### 3.4 Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your frontend URL will be shown (e.g., `https://book-exchange.vercel.app`)

---

## 🔄 Step 4: Update Backend CORS

After frontend is deployed, update backend CORS:

1. Go to Render dashboard
2. Select your backend service
3. Go to Environment
4. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://book-exchange.vercel.app
   ```
5. Click "Save" (this will redeploy)

---

## ✅ Testing Deployment

### Test Backend
```bash
curl https://book-exchange-backend.onrender.com/api/health
```

Should return:
```json
{"status":"ok","message":"API is running"}
```

### Test Frontend
- Go to `https://book-exchange.vercel.app`
- Try logging in with test account:
  - Email: `admin@example.com`
  - Password: `admin123`

### Test Database Connection
- Login as admin
- Go to Admin Dashboard
- Check if data loads correctly

---

## 📝 Complete Environment Variables List

### Backend (.env on Render)

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Neon connection string | `postgresql://user:pass@host.neon.tech/db` |
| `JWT_SECRET` | Random 32+ char string | `aB3$xY9@mK2#pL8&qR5!vW1^zT4%uI6*` |
| `NODE_ENV` | `production` | `production` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Frontend URL | `https://book-exchange.vercel.app` |

### Frontend (.env on Vercel)

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Backend URL | `https://book-exchange-backend.onrender.com` |

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] DATABASE_URL is from Neon (not local)
- [ ] NODE_ENV is set to `production`
- [ ] CORS_ORIGIN matches your Vercel URL
- [ ] No credentials in GitHub (use .env files)
- [ ] Database backups enabled on Neon
- [ ] HTTPS enabled (automatic on Vercel & Render)

---

## 🐛 Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Check JWT_SECRET is set
- View logs in Render dashboard

### Frontend can't connect to backend
- Check VITE_API_URL is correct
- Check backend CORS_ORIGIN includes frontend URL
- Check browser console for errors

### Database connection fails
- Verify Neon connection string
- Check IP whitelist on Neon (should allow all)
- Test connection locally first

### Login not working
- Check JWT_SECRET matches between local and production
- Check database has test data (run setup-fresh)
- Check browser localStorage for token

---

## 📚 Useful Links

- **Neon:** https://neon.tech
- **Render:** https://render.com
- **Vercel:** https://vercel.com
- **Neon Docs:** https://neon.tech/docs
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## 🚀 Quick Deployment Checklist

- [ ] Database created on Neon
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured
- [ ] Test login works
- [ ] Admin dashboard loads
- [ ] Can browse books
- [ ] Can create exchanges

---

## 💡 Notes

- Render free tier has 15-minute inactivity timeout (service spins down)
- Vercel free tier has 100GB bandwidth/month
- Neon free tier has 3GB storage
- For production, consider upgrading to paid plans
- Set up monitoring/alerts for uptime
