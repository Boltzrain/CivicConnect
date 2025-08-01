import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const complaintService = {
  // Create new complaint
  createComplaint: async (complaintData) => {
    try {
      const formData = new FormData()
      
      // Handle nested location object
      formData.append('issueType', complaintData.issueType)
      formData.append('location[city]', complaintData.location.city)
      formData.append('location[pincode]', complaintData.location.pincode)
      formData.append('location[address]', complaintData.location.address)
      formData.append('description', complaintData.description)
      
      // Add image if provided
      if (complaintData.image) {
        formData.append('image', complaintData.image)
      }

      const response = await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get user's complaints
  getUserComplaints: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/complaints?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get single complaint
  getComplaint: async (id) => {
    try {
      const response = await api.get(`/complaints/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update complaint status
  updateComplaintStatus: async (id, status) => {
    try {
      const response = await api.put(`/complaints/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Mark complaint as sent
  markComplaintSent: async (id, method) => {
    try {
      const response = await api.post(`/complaints/${id}/sent`, { method })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete complaint
  deleteComplaint: async (id) => {
    try {
      const response = await api.delete(`/complaints/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get supported cities
  getSupportedCities: async () => {
    try {
      const response = await api.get('/departments/cities')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get issue types
  getIssueTypes: async () => {
    try {
      const response = await api.get('/departments/issue-types')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get departments by city
  getDepartmentsByCity: async (city) => {
    try {
      const response = await api.get(`/departments/city/${encodeURIComponent(city)}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get specific department by city and issue type
  getDepartmentByLocationAndIssue: async (city, issueType) => {
    try {
      const response = await api.get(`/departments/${encodeURIComponent(city)}/${encodeURIComponent(issueType)}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get department info for complaint
  getDepartmentInfo: async (id) => {
    try {
      const response = await api.get(`/complaints/${id}/department`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Generate WhatsApp link
  generateWhatsAppLink: (complaintLetter, departmentPhone) => {
    const message = encodeURIComponent(complaintLetter)
    const phoneNumber = departmentPhone.replace(/[\s\-\+]/g, '') // Remove spaces, dashes, plus signs
    return `https://wa.me/${phoneNumber}?text=${message}`
  },

  // Generate email link
  generateEmailLink: (complaintLetter, departmentEmail, subject) => {
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(complaintLetter)
    return `mailto:${departmentEmail}?subject=${encodedSubject}&body=${encodedBody}`
  }
} 