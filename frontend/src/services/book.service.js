import api from './api';

export async function getBooks(query = {}) {
  const { data } = await api.get('/books', { params: query });
  return data;
}

export async function getBook(id) {
  const { data } = await api.get(`/books/${id}`);
  return data;
}

export async function createBook(bookData) {
  const { data } = await api.post('/books', bookData);
  return data;
}

export async function updateBook(id, bookData) {
  const { data } = await api.put(`/books/${id}`, bookData);
  return data;
}

export async function deleteBook(id) {
  const { data } = await api.delete(`/books/${id}`);
  return data;
}
