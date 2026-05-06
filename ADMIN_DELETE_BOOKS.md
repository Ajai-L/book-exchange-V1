# Admin Delete Books Feature

## What Was Added

Admins can now delete books directly from the Browse Books page (`/books`). A red delete button appears on each book card only for admin users.

---

## Changes Made

### 1. BookCard Component (`frontend/src/components/books/BookCard.jsx`)
- Added `isAdmin` prop to check if user is admin
- Added `onDelete` prop to handle delete action
- Added delete button that only shows for admins
- Button includes confirmation dialog before deletion

```jsx
{isAdmin && onDelete && (
  <button
    onClick={() => {
      if (confirm('Delete this book?')) {
        onDelete(book.id)
      }
    }}
    className="mt-3 w-full px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium transition-colors"
  >
    🗑️ Delete
  </button>
)}
```

### 2. BookList Page (`frontend/src/pages/public/BookList.jsx`)
- Imported `useAuth` to get current user
- Added `handleDelete` function to call backend API
- Pass `isAdmin` and `onDelete` to BookCard component
- Removes deleted book from list immediately

```jsx
async function handleDelete(bookId) {
  try {
    await deleteBook(bookId)
    setBooks(books.filter(b => b.id !== bookId))
    alert('Book deleted successfully')
  } catch (err) {
    alert('Failed to delete book: ' + (err.response?.data?.message || err.message))
  }
}
```

### 3. Backend Already Supports Admin Delete
The backend (`backend/routes/books.routes.js`) already has the delete endpoint with admin check:

```javascript
// Delete book (Protected, Owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  // ...
  if (checkOwnership.rows[0].owner_id !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  // ...
});
```

---

## How It Works

1. **Admin logs in** with `admin@example.com` / `admin123`
2. **Goes to Browse Books** page (`http://localhost:5173/books`)
3. **Sees red delete button** on each book card (only visible to admins)
4. **Clicks delete button**
5. **Confirms deletion** in popup dialog
6. **Book is deleted** from database and removed from list

---

## User Permissions

| User Type | Can Delete | Where |
|-----------|-----------|-------|
| Regular User | ❌ No | - |
| Book Owner | ✅ Yes | Only their own books (via My Books) |
| Admin | ✅ Yes | Any book (Browse Books page) |

---

## Testing

### Test as Admin

1. Login: `admin@example.com` / `admin123`
2. Go to: `http://localhost:5173/books`
3. Look for red "🗑️ Delete" button on book cards
4. Click delete and confirm
5. Book should disappear from list

### Verify in Database

```bash
psql -U postgres -d book_exchange -c "SELECT COUNT(*) FROM books;"
```

Count should decrease after deletion.

---

## Files Modified

1. ✅ `frontend/src/components/books/BookCard.jsx` - Added delete button UI
2. ✅ `frontend/src/pages/public/BookList.jsx` - Added delete handler and admin check
3. ✅ `backend/routes/books.routes.js` - Already supports admin delete (no changes needed)

---

## API Endpoint Used

```
DELETE /api/books/:id
Authorization: Bearer <admin_token>
```

Response:
```json
{
  "message": "Book removed"
}
```

---

## Notes

- Delete button only appears for users with `role === 'ADMIN'`
- Confirmation dialog prevents accidental deletion
- Deleted books are removed from the list immediately
- Error messages are shown if deletion fails
- Regular users cannot see or use the delete button
