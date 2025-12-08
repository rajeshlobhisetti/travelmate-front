// Use environment variable if available, otherwise fall back to production URL
const API_BASE = import.meta.env.VITE_API_BASE || 'https://travelmate-1-0c4k.onrender.com/api';

// Helper function to handle API requests
async function api(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  // Add authorization header if needed
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  // Handle empty responses (like 204 No Content)
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
  
  if (!res.ok) {
    const errorMessage = data?.message || `Request failed with status ${res.status}`;
    const error = new Error(errorMessage);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication API
export const AuthAPI = {
  register: (payload) => api('/auth/register', { 
    method: 'POST', 
    body: payload,
    auth: false 
  }),
  login: (payload) => api('/auth/login', { 
    method: 'POST', 
    body: payload,
    auth: false 
  }),
  me: () => api('/auth/me'),
  logout: () => {
    // Clear token from localStorage on logout
    localStorage.removeItem('token');
    return api('/auth/logout', { method: 'POST' });
  }
};

// Trips API
export const TripsAPI = {
  // Get all trips with optional filters
  list: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters if provided
    if (filters.destination) queryParams.append('destination', filters.destination);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    
    const queryString = queryParams.toString();
    return api(`/trips${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get a single trip by ID
  get: (id) => api(`/trips/${id}`),
  
  // Create a new trip (admin only)
  create: (tripData) => api('/trips', { 
    method: 'POST', 
    body: tripData 
  }),
  
  // Update an existing trip (admin only)
  update: (id, updates) => api(`/trips/${id}`, { 
    method: 'PUT', 
    body: updates 
  }),
  
  // Delete a trip (admin only)
  delete: (id) => api(`/trips/${id}`, { 
    method: 'DELETE' 
  })
};

// Bookings API
export const BookingsAPI = {
  // Get current user's bookings
  my: () => api('/bookings/my-bookings'),
  
  // Create a new booking
  create: (tripId, bookingData) => 
    api('/bookings', {
      method: 'POST',
      body: { 
        tripId, 
        ...bookingData 
      }
    }),
  
  // Cancel a booking
  cancel: (bookingId) => 
    api(`/bookings/${bookingId}/cancel`, { 
      method: 'POST' 
    }),
  
  // Get booking details
  get: (bookingId) => api(`/bookings/${bookingId}`)
};

// Admin API
export const AdminAPI = {
  // Admin authentication
  login: (credentials) => 
    api('/admin/login', { 
      method: 'POST', 
      body: credentials,
      auth: false 
    }),
  
  // Get admin profile
  me: () => api('/admin/me'),
  
  // Get all trips (admin view)
  trips: (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    return api(`/admin/trips?${queryParams}`);
  },
  
  // Create a new trip
  createTrip: (tripData) => 
    api('/admin/trips', { 
      method: 'POST', 
      body: tripData 
    }),
  
  // Get bookings for a specific trip
  bookingsForTrip: (tripId) => 
    api(`/admin/trips/${tripId}/bookings`),
  
  // Get all bookings (admin view)
  bookings: (filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    return api(`/admin/bookings?${queryParams}`);
  },
  
  // Update booking status
  updateBookingStatus: (bookingId, status) => 
    api(`/admin/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: { status }
    })
};
