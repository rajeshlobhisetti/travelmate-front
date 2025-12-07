const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function api(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

export const AuthAPI = {
  register: (payload) => api('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => api('/auth/login', { method: 'POST', body: payload }),
  me: () => api('/auth/me'),
  logout: () => api('/auth/logout', { method: 'POST' })
};

export const TripsAPI = {
  list: (params) => {
    let qs = '';
    if (params && (params.start || params.end)) {
      const q = new URLSearchParams();
      if (params.start) q.set('start', params.start);
      if (params.end) q.set('end', params.end);
      qs = `?${q.toString()}`;
    }
    return api(`/trips${qs}`);
  },
  get: (id) => api(`/trips/${id}`),
  create: (payload) => api('/trips', { method: 'POST', body: payload }),
  update: (id, payload) => api(`/trips/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => api(`/trips/${id}`, { method: 'DELETE' })
};

export const BookingsAPI = {
  my: () => api('/bookings'),
  create: (tripId, { quantity = 1, guests, contactPhone } = {}) => api('/bookings', { method: 'POST', body: { tripId, quantity, guests, contactPhone } }),
  cancel: (id) => api(`/bookings/${id}`, { method: 'DELETE' })
};

export const AdminAPI = {
  login: (payload) => api('/admin/login', { method: 'POST', body: payload }),
  me: () => api('/admin/me'),
  trips: () => api('/admin/trips'),
  createTrip: (payload) => api('/admin/trips', { method: 'POST', body: payload }),
  bookingsForTrip: (id) => api(`/admin/trips/${id}/bookings`),
  bookings: () => api('/admin/bookings')
};

