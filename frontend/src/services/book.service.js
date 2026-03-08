export const MOCK_BOOKS = [
  {
    id: '1', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', condition: 'Good',
    description: 'A psychological drama exploring the mind of Raskolnikov, a destitute student who formulates a plan to kill an unscrupulous pawnbroker. The psychological tension builds continuously throughout this classic.',
    coverImage: 'https://covers.openlibrary.org/b/id/14911181-M.jpg',
    ownerId: '2', owner: { firstName: 'Karthik', city: 'Chennai', campus: 'IITM' },
    status: 'Available', isbn: '9780140449136', createdAt: '2025-01-01T10:00:00Z'
  },
  {
    id: '2', title: 'The Bell Jar', author: 'Sylvia Plath', condition: 'Like New',
    description: 'A semi-autobiographical novel that follows the descent into mental illness of a young woman named Esther Greenwood in 1950s America.',
    coverImage: 'https://ia800100.us.archive.org/view_archive.php?archive=/5/items/l_covers_0012/l_covers_0012_75.zip&file=0012752096-L.jpg',
    ownerId: '3', owner: { firstName: 'arjun', city: 'Bangalore', campus: 'IISc' },
    status: 'Reserved', isbn: '9780060830490', createdAt: '2025-01-05T10:00:00Z'
  },
  {
    id: '3', title: 'Animal Farm', author: 'George Orwell', condition: 'Fair',
    description: 'A satirical allegorical novella that reflects events leading up to the Russian Revolution of 1917 and then on into the Stalinist era of the Soviet Union.',
    coverImage: 'https://covers.openlibrary.org/b/id/15139354-M.jpg',
    ownerId: '1', owner: { firstName: 'Pradeep', city: 'Hyderabad', campus: 'UoH' },
    status: 'Exchanged', isbn: '9780451526342', createdAt: '2025-02-01T10:00:00Z'
  },
  {
    id: '4', title: 'The King in Yellow', author: 'Robert W. Chambers', condition: 'Acceptable',
    description: 'A book of short stories, exploring a fictional play of the same title which induces despair or madness in those who read it.',
    coverImage: 'https://covers.openlibrary.org/b/id/14842417-M.jpg',
    ownerId: '4', owner: { firstName: 'Vikram', city: 'Kochi', campus: 'CUSAT' },
    status: 'Removed', isbn: '9781498132432', createdAt: '2025-03-01T10:00:00Z'
  },
  {
    id: '5', title: 'No Longer Human', author: 'Osamu Dazai', condition: 'Like New',
    description: 'Told in the form of notebooks, revealing the inner life of a young man who is unable to conform to the norms of human society.',
    coverImage: 'https://covers.openlibrary.org/b/id/15142271-M.jpg',
    ownerId: '5', owner: { firstName: 'Ravi', city: 'Trivandrum', campus: 'CET' },
    status: 'Available', isbn: '9780811204811', createdAt: '2025-03-05T10:00:00Z'
  },
  {
    id: '6', title: 'Pride and Prejudice', author: 'Jane Austen', condition: 'Good',
    description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments.',
    coverImage: 'https://covers.openlibrary.org/b/id/14845129-M.jpg',
    ownerId: '6', owner: { firstName: 'sanjay', city: 'Madurai', campus: 'MKU' },
    status: 'Available', isbn: '9780141439518', createdAt: '2025-03-06T10:00:00Z'
  },
  {
    id: '7', title: '1984', author: 'George Orwell', condition: 'Fair',
    description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviors within society.',
    coverImage: 'https://covers.openlibrary.org/b/id/12693610-M.jpg',
    ownerId: '7', owner: { firstName: 'Kiran', city: 'Coimbatore', campus: 'KCT' },
    status: 'Reserved', isbn: '9780451524935', createdAt: '2025-03-06T11:00:00Z'
  },
  {
    id: '8', title: 'Macbeth', author: 'William Shakespeare', condition: 'Like New',
    description: 'A tragedy that dramatizes the damaging physical and psychological effects of political ambition on those who seek power for its own sake.',
    coverImage: 'https://covers.openlibrary.org/b/id/8258385-L.jpg',
    ownerId: '8', owner: { firstName: 'Pooja', city: 'Mysore', campus: 'UoM' },
    status: 'Available', isbn: '9780743477109', createdAt: '2025-03-07T09:00:00Z'
  },
  {
    id: '9', title: 'The Iliad', author: 'Homer', condition: 'Acceptable',
    description: 'An ancient Greek epic poem set during the Trojan War, the ten-year siege of the city of Troy by a coalition of Greek states, it tells of the battles and events during the weeks of a quarrel between King Agamemnon and the warrior Achilles.',
    coverImage: 'https://covers.openlibrary.org/b/id/12621988-M.jpg',
    ownerId: '9', owner: { firstName: 'Anand', city: 'Mangalore', campus: 'NITK' },
    status: 'Available', isbn: '9780140275360', createdAt: '2025-03-08T08:00:00Z'
  },
  {
    id: '10', title: 'The Metamorphosis', author: 'Franz Kafka', condition: 'Like New',
    description: 'A novella telling the story of salesman Gregor Samsa, who wakes one morning to find himself inexplicably transformed into a huge insect and subsequently struggles to adjust to this new condition.',
    coverImage: 'https://covers.openlibrary.org/b/id/7976057-M.jpg',
    ownerId: '1', owner: { firstName: 'Leaf', lastName: 'Light', city: 'Unknown Location', campus: '' },
    status: 'Available', isbn: '9780553213690', createdAt: '2025-03-08T12:00:00Z'
  },
  {
    id: '11', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', condition: 'Good',
    description: 'A philosophical novel revolving around Dorian Gray, a young man who sells his soul for eternal youth while his portrait ages and records every sin.',
    coverImage: 'https://covers.openlibrary.org/b/id/14314700-M.jpg',
    ownerId: '1', owner: { firstName: 'Leaf', lastName: 'Light', city: 'Unknown Location', campus: '' },
    status: 'Available', isbn: '9780141439570', createdAt: '2025-03-08T13:00:00Z'
  }
];

export async function getBooks(query = {}) {
  if (query.q) {
    const q = query.q.toLowerCase();
    return MOCK_BOOKS.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }
  return [...MOCK_BOOKS];
}

export async function getBook(id) {
  const book = MOCK_BOOKS.find(b => b.id === id);
  if (!book) throw new Error('Not found');
  return { ...book };
}

export async function createBook(data) {
  const newBook = { ...data, id: String(Date.now()), status: 'Available', ownerId: '1', owner: { firstName: 'Leaf', lastName: 'Light', city: 'Unknown Location', campus: '' }, createdAt: new Date().toISOString() };
  MOCK_BOOKS.push(newBook);
  return newBook;
}

export async function updateBook(id, data) {
  const idx = MOCK_BOOKS.findIndex(b => b.id === id);
  if (idx > -1) { MOCK_BOOKS[idx] = { ...MOCK_BOOKS[idx], ...data }; return MOCK_BOOKS[idx]; }
  throw new Error('Not found');
}

export async function deleteBook(id) {
  const idx = MOCK_BOOKS.findIndex(b => b.id === id);
  if (idx > -1) {
    const b = MOCK_BOOKS[idx];
    MOCK_BOOKS.splice(idx, 1);
    return b;
  }
  throw new Error('Not found');
}
