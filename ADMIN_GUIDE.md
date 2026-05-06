# 🔐 Admin Guide - Book Exchange Platform

## Admin Login Instructions

### How to Login as Admin

**Default Admin Credentials:**
```
Email: admin@example.com
Password: admin123
```

### Steps to Login:
1. Go to the login page (`http://localhost:5173/login`)
2. Enter the admin email: `admin@example.com`
3. Enter the admin password: `admin123`
4. Click "Sign In"
5. Once logged in, you'll see **"📊 Admin Dashboard"** in the profile menu (click the profile icon)
6. Click it to access the admin control panel

---

## 🎯 Admin Functions & Capabilities

### 1. **📊 Dashboard** - Platform Analytics
**Location:** `/admin/dashboard`

**What you see:**
- Total number of users on the platform
- Number of admin accounts
- Total books listed
- Total exchanges made
- Completed exchanges count
- Pending exchanges count
- Platform activity overview

**Actions:** View-only (displays real-time statistics)

---

### 2. **👥 User Management** - `/admin/users`

**View all users in a comprehensive table showing:**
- User name and email
- User role (USER or ADMIN)
- Location (city and campus)
- Number of books they've listed
- Number of exchanges they're involved in
- Account creation date

**Actions you can perform:**

#### ✔️ **View User Details**
- Click "View" to see full user profile including:
  - User's bio
  - Books submitted count
  - Total exchanges participated
  - Account creation date

#### ✅ **Promote User to Admin**
- Select a regular USER
- Click "Promote"
- User is now an ADMIN with full platform management access
- Admins can:
  - Manage users
  - Moderate content
  - Manage exchanges
  - View analytics

#### ⬇️ **Demote Admin to User**
- Select an ADMIN user
- Click "Demote"
- Admin is converted back to regular USER role
- Cannot demote yourself (self-protection)

#### 🗑️ **Delete User**
- Click "Delete" to permanently remove a user account
- This also removes:
  - All books they listed
  - All exchange records associated with them
  - Cannot delete yourself (self-protection)
- **Warning:** This action is irreversible

---

### 3. **📚 Books Management** - `/admin/books`

**View all books in the system with:**
- Book title and author
- Book owner information (name & email)
- Book condition
- Availability status (Available/Unavailable)
- Number of pending exchanges for this book
- Date book was added

**Features:**

#### 🔍 **Filter Books**
- All Books - see entire catalog
- Available - only books currently available for exchange
- Unavailable - books in active exchanges or removed from circulation

#### 🗑️ **Delete Books**
- Remove inappropriate content
- Delete books that violate platform guidelines
- Books with pending exchanges can still be deleted
- **Action is permanent**

---

### 4. **🔄 Exchange Management** - `/admin/reports` (labeled as Reports)

**View all exchanges with detailed information:**
- Book title and author
- Requester (person asking for the book)
- Book owner (person who owns the book)
- Current exchange status
- Exchange creation date

**Manage Exchange Status:**

#### 📊 **Status Overview**
- **Total Exchanges:** All exchanges made
- **Pending:** Waiting for book owner response
- **Accepted:** Owner accepted the exchange request
- **Completed:** Exchange successfully finished
- **Rejected:** Exchange request declined

#### 🎛️ **Status Actions**

**Mark as Completed (✓)**
- When both parties have exchanged the book
- Changes status from PENDING or ACCEPTED to COMPLETED

**Mark as Rejected (✕)**
- Reject an exchange request
- Can be used for disputed or cancelled exchanges
- Cannot mark already COMPLETED exchanges as rejected

#### Filter by Status
- View all exchanges or filter by specific status
- Helps prioritize management tasks

---

## 🔑 Key Features Summary

| Feature | Admin Can Do |
|---------|-------------|
| **User Management** | Create, view, promote, demote, delete users |
| **Admin Roles** | Grant/revoke admin access |
| **Content Moderation** | Delete inappropriate books |
| **Exchange Oversight** | Monitor and manage all exchanges |
| **Analytics** | View platform statistics in real-time |
| **User Promotion** | Elevate trusted users to admin status |

---

## 📋 Admin Responsibilities

As an admin, you should:

✅ **Monitor platform activity** - Check dashboard regularly for unusual patterns
✅ **Moderate content** - Remove books that violate guidelines
✅ **Manage disputes** - Resolve exchange issues through status management
✅ **Maintain user trust** - Follow up on and resolve reported issues
✅ **Scale the team** - Promote trustworthy users to admin when needed
✅ **Protect the platform** - Delete spam or inappropriate users

---

## 🚫 Admin Restrictions

❌ **Cannot:**
- Delete your own admin account
- Demote yourself
- View other admins' personal messages
- See user password hashes (for security)
- Modify the platform code

✅ **Can:**
- Manage all other admin accounts
- View all user data and activity
- Control all platform content
- Delete any user or book
- Manage exchange disputes

---

## 🔒 Security Best Practices

1. **Keep credentials safe** - Don't share admin login details
2. **Change default password** - Alter the default `admin123` password in production
3. **Regular audits** - Check user and exchange activity regularly
4. **Secure database** - Change DATABASE_URL in `.env` to production credentials
5. **Use HTTPS** - Always use HTTPS in production environments

---

## 📞 Troubleshooting

### "Admin Dashboard not appearing"
- Verify you're logged in with admin credentials
- Check browser console for errors
- Try logging out and back in

### "Cannot delete user"
- The user might already be deleted
- Refresh the page and try again
- Check that you have admin permissions

### "Exchange status not updating"
- Ensure the exchange exists
- Try refreshing the page
- Check that the status value is valid (PENDING, ACCEPTED, COMPLETED, REJECTED)

---

## 🎓 Next Steps

1. **First Login:** Change the default admin password
2. **Review Dashboard:** Check current platform statistics
3. **Inspect Users:** Familiarize yourself with registered users
4. **Monitor Exchanges:** Look for any suspicious patterns
5. **Review Books:** Ensure all content meets guidelines

**Default Admin Account:**
```
Email: admin@example.com
Password: admin123 (CHANGE THIS IN PRODUCTION!)
```

Change this password immediately after your first login!

---

*Last Updated: May 2026*
*Platform: OpenSelf Book Exchange*
