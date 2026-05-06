# 🚀 Deployment Quick Reference

## All Environment Variables at a Glance

### Backend (Render)
```
DATABASE_URL=postgresql://user:password@host.neon.tech/database_name
JWT_SECRET=aB3$xY9@mK2#pL8&qR5!vW1^zT4%uI6*jN7(sO0)dF4-eG5+hH6=iJ7[kL8]
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://book-exchange.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://book-exchange-backend.onrender.com
```

---

## 📋 Deployment Checklist

### 1. Database (Neon)
- [ ] Create Neon account
- [ ] Create new project
- [ ] Copy connection string
- [ ] Run database setup
- [ ] Test connection

### 2. Backend (Render)
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create Web Service
- [ ] Set environment variables
- [ ] Deploy
- [ ] Copy backend URL

### 3. Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `./frontend`
- [ ] Set environment variables
- [ ] Deploy
- [ ] Copy frontend URL

### 4. Final Setup
- [ ] Update backend CORS_ORIGIN with frontend URL
- [ ] Test login
- [ ] Test API calls
- [ ] Check admin dashboard

---

## 🔑 Environment Variables Summary

| Service | Variable | Value |
|---------|----------|-------|
| **Render** | DATABASE_URL | Neon connection string |
| **Render** | JWT_SECRET | Random 32+ char string |
| **Render** | NODE_ENV | `production` |
| **Render** | PORT | `5000` |
| **Render** | CORS_ORIGIN | Vercel frontend URL |
| **Vercel** | VITE_API_URL | Render backend URL |

---

## 🔗 URLs After Deployment

- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-project.onrender.com`
- **Database:** `host.neon.tech` (Neon)

---

## 🧪 Quick Tests

### Test Backend
```bash
curl https://your-backend.onrender.com/api/health
```

### Test Frontend
- Open `https://your-frontend.vercel.app`
- Login with `admin@example.com` / `admin123`

### Test Database
- Login as admin
- Go to Admin Dashboard
- Check if data loads

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Update CORS_ORIGIN in Render |
| Can't connect to API | Check VITE_API_URL in Vercel |
| Login fails | Check JWT_SECRET matches |
| Database error | Verify DATABASE_URL is correct |
| Render spins down | Upgrade to paid plan or use cron job |

---

## 📚 Files Modified for Deployment

- ✅ `backend/.env.example` - Created
- ✅ `frontend/.env.example` - Created
- ✅ `frontend/src/services/api.js` - Updated for env vars
- ✅ `frontend/vite.config.js` - Updated for env vars
- ✅ `DEPLOYMENT_GUIDE.md` - Created
- ✅ `ENVIRONMENT_VARIABLES.md` - Created

---

## 🎯 Next Steps

1. Read `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Read `ENVIRONMENT_VARIABLES.md` for all variable details
3. Deploy database on Neon
4. Deploy backend on Render
5. Deploy frontend on Vercel
6. Test everything works
7. Push changes to GitHub
