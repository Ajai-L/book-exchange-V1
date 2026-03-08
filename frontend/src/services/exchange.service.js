export let MOCK_EXCHANGES = [];
let nextId = 1;

export async function getExchanges(status = null) {
  if (status) return MOCK_EXCHANGES.filter(e => e.status === status);
  return [...MOCK_EXCHANGES];
}

export async function getExchange(id) {
  const e = MOCK_EXCHANGES.find(e => e.id === id);
  if (!e) throw new Error('Not found');
  return { ...e };
}

export async function createExchange(data) {
  const e = {
    id: String(nextId++),
    bookId: data.bookId,
    notes: data.notes,
    requesterId: '1',
    requester: { firstName: 'Mock', lastName: 'User' },
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  MOCK_EXCHANGES.push(e);
  return e;
}

export async function updateExchange(id, status) {
  const idx = MOCK_EXCHANGES.findIndex(e => e.id === id);
  if (idx > -1) {
    MOCK_EXCHANGES[idx] = { ...MOCK_EXCHANGES[idx], status };
    return MOCK_EXCHANGES[idx];
  }
  throw new Error('Not found');
}

export async function deleteExchange(id) {
  const idx = MOCK_EXCHANGES.findIndex(e => e.id === id);
  if (idx > -1) {
    const e = MOCK_EXCHANGES[idx];
    MOCK_EXCHANGES.splice(idx, 1);
    return e;
  }
  throw new Error('Not found');
}

export function acceptExchange(id) { return updateExchange(id, 'ACCEPTED'); }
export function rejectExchange(id) { return updateExchange(id, 'REJECTED'); }
export function completeExchange(id) { return updateExchange(id, 'COMPLETED'); }
