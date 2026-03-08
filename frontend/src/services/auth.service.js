export async function login(credentials) {
  const payload = btoa(JSON.stringify({
    sub: '1', role: 'USER', name: 'Leaf Light', firstName: 'Leaf', lastName: 'Light'
  }));
  return { token: `mockHeader.${payload}.mockSignature` };
}

export async function register(data) {
  return login({});
}

export async function getMe() {
  return { id: '1', role: 'USER', name: 'Leaf Light', firstName: 'Leaf', lastName: 'Light' };
}
