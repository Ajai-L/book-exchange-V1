import api from './api';

export async function getExchanges(status = null) {
  // If status is needed, pass as query params (e.g. ?status=PENDING)
  // Our backend returns all exchanges for the logged in user right now.
  const { data } = await api.get('/exchanges');
  if(status) {
      return data.filter(e => e.status === status);
  }
  return data;
}

export async function getExchange(id) {
  // Can just do front-end filtering here, or add single fetch backend endpoint
  const exchanges = await getExchanges();
  const e = exchanges.find(ex => ex.id === parseInt(id));
  if (!e) throw new Error('Not found');
  return e;
}

export async function createExchange(exchangeData) {
  const { data } = await api.post('/exchanges', exchangeData);
  return data;
}

export async function updateExchange(id, status) {
  const { data } = await api.put(`/exchanges/${id}`, { status });
  return data;
}

export async function deleteExchange(id) {
   // Our backend logic does not currently support deleting exchanges for bookkeeping purposes
   throw new Error("Deleting history exchanges not allowed");
}

export function acceptExchange(id) { return updateExchange(id, 'ACCEPTED'); }
export function rejectExchange(id) { return updateExchange(id, 'REJECTED'); }
export function completeExchange(id) { return updateExchange(id, 'COMPLETED'); }
