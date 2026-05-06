# Profile Update Fix - Complete Solution

## Problem
When users tried to update their profile (bio, city, campus), they got "Failed to update profile" error, and the data wasn't being saved to PostgreSQL.

## Root Causes Found

### 1. **Wrong API Endpoint**
- Frontend was calling: `/api/users/{id}`
- Backend endpoint was: `/api/profiles/{id}`
- **Fixed:** Updated frontend to use correct endpoint

### 2. **Wrong Field Names**
- Frontend was sending all form fields
- Backend only accepts: `bio`, `city`, `campus`, `profileImage`
- **Fixed:** Updated frontend to send only these fields

### 3. **Database Column Typo**
- Backend query had: `Bio` (capital B)
- Database column is: `bio` (lowercase)
- **Fixed:** Corrected column name in query

### 4. **Missing User Data in JWT Token**
- JWT token didn't include `city`, `campus`, `bio`
- Frontend couldn't display updated values after save
- **Fixed:** Added these fields to JWT payload in login/register

### 5. **AuthContext Not Storing Profile Data**
- AuthContext only stored `id`, `role`, `name`
- Profile page couldn't access `city`, `campus`, `bio`
- **Fixed:** Updated AuthContext to store all profile fields

---

## Changes Made

### Backend (`backend/routes/auth.routes.js`)
```javascript
// Added to JWT payload in both login and register:
const payload = {
  id: user.id,
  email: user.email,
  role: user.role,
  name: `${user.first_name} ${user.last_name}`,
  firstName: user.first_name,
  lastName: user.last_name,
  city: user.city,           // ✅ NEW
  campus: user.campus,       // ✅ NEW
  bio: user.bio              // ✅ NEW
};
```

### Backend (`backend/routes/profile.routes.js`)
```javascript
// Fixed column name and added logging
const updateRes = await query(
  `UPDATE users SET 
    bio = COALESCE($1, bio),
    profile_image = COALESCE($2, profile_image),
    city = COALESCE($3, city),
    campus = COALESCE($4, campus),
    updated_at = CURRENT_TIMESTAMP
   WHERE id = $5
   RETURNING id, email, first_name, last_name, bio, profile_image, city, campus`,
  [bio || null, profileImage || null, city || null, campus || null, userId]
);
```

### Frontend (`frontend/src/context/AuthContext.jsx`)
```javascript
// Updated all three functions to include profile fields:
setUser({ 
  id: payload.id, 
  email: payload.email,
  role: payload.role, 
  name, 
  firstName: payload.firstName, 
  lastName: payload.lastName,
  city: payload.city,           // ✅ NEW
  campus: payload.campus,       // ✅ NEW
  bio: payload.bio              // ✅ NEW
})
```

### Frontend (`frontend/src/pages/user/Profile.jsx`)
```javascript
// Fixed endpoint and field names:
const response = await fetch(`/api/profiles/${user.id}`, {  // ✅ Changed from /api/users
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    bio: form.bio,
    city: form.city,
    campus: form.campus
    // ✅ Removed firstName, lastName (not updatable via this endpoint)
  })
})
```

---

## How to Test

### 1. Login to the app
```
Email: john@example.com
Password: password123
```

### 2. Go to Profile page
```
http://localhost:5173/profile
```

### 3. Click "Edit Profile"

### 4. Update fields:
- City: "New City"
- Campus: "New Campus"
- Bio: "My updated bio"

### 5. Click "Save Changes"

### 6. Verify in database
```bash
cd backend
node -e "require('dotenv').config(); const { query } = require('./db/pool'); (async () => { const res = await query('SELECT id, email, bio, city, campus FROM users WHERE id = 2'); console.log(JSON.stringify(res.rows[0], null, 2)); process.exit(); })()"
```

Should show your updated values ✅

---

## Data Flow

```
User edits profile
    ↓
Frontend sends PUT /api/profiles/{id}
    ↓
Backend updates database
    ↓
Backend returns updated user data
    ↓
Frontend shows success message
    ↓
Page reloads to show updated data
    ↓
AuthContext reads new JWT with profile data
    ↓
Profile displays updated values ✅
```

---

## Files Modified

1. ✅ `backend/routes/auth.routes.js` - Added profile fields to JWT
2. ✅ `backend/routes/profile.routes.js` - Fixed column name and added logging
3. ✅ `frontend/src/context/AuthContext.jsx` - Store profile fields
4. ✅ `frontend/src/pages/user/Profile.jsx` - Fixed endpoint and field names

---

## Verification

The data IS being saved to PostgreSQL. You can verify with:

```bash
psql -U postgres -d book_exchange -c "SELECT id, email, bio, city, campus FROM users WHERE id = 2;"
```

Output should show your updated values.
