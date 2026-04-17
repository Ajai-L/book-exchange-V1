#!/bin/bash

# Login users
JOHN_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' | jq -r '.token')

BOB_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","password":"pass123"}' | jq -r '.token')

echo "JOHN_TOKEN=$JOHN_TOKEN"
echo "BOB_TOKEN=$BOB_TOKEN"

# Bob uploads a book
echo -e "\n=== Bob uploading a book ==="
BOB_BOOK=$(curl -s -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BOB_TOKEN" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","condition":"Excellent","description":"Classic American novel","isbn":"9780743273565"}' | jq '{id: .id, title: .title, owner_id: .owner_id}')

BOB_BOOK_ID=$(echo $BOB_BOOK | jq -r '.id')
echo "Book created: $BOB_BOOK"
echo "Book ID: $BOB_BOOK_ID"

# John requests to borrow Bob's book
echo -e "\n=== John requesting to borrow Bob's book ==="
REQUEST=$(curl -s -X POST http://localhost:5000/api/exchanges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JOHN_TOKEN" \
  -d "{\"bookId\": $BOB_BOOK_ID, \"notes\": \"I'd love to read this\"}")

echo $REQUEST | jq '.'

# Get all users with their books
echo -e "\n=== All books in database ==="
curl -s http://localhost:5000/api/books | jq '.[] | {id, title, owner_id, owner}'

# Get all exchange requests
echo -e "\n=== All exchange requests ==="
curl -s -H "Authorization: Bearer $JOHN_TOKEN" http://localhost:5000/api/exchanges | jq '.'

# Check database directly
echo -e "\n=== Database: All users ==="
PGPASSWORD=postgres psql -U postgres -h localhost -d book_exchange -c "SELECT id, email, first_name, last_name FROM users ORDER BY id;"

echo -e "\n=== Database: All books ==="
PGPASSWORD=postgres psql -U postgres -h localhost -d book_exchange -c "SELECT id, owner_id, title, author FROM books ORDER BY id;"

echo -e "\n=== Database: All exchanges ==="
PGPASSWORD=postgres psql -U postgres -h localhost -d book_exchange -c "SELECT id, book_id, requester_id, status FROM exchanges ORDER BY id;"

