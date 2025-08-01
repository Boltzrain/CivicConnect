import axios from 'axios'

const API_URL = '/api/auth'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  // Register user
  register: async (name, email, password) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
    })
    return response
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/login', {
      email,
      password,
    })
    return response
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/me')
    return response
  },

  // Logout (client-side only)
  logout: () => {
    sessionStorage.removeItem('token')
  },
} 