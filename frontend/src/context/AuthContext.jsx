import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (token) {
        const userData = await authService.getCurrentUser()
        setUser(userData.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      sessionStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError('')
      setLoading(true)
      const response = await authService.login(email, password)
      
      if (response.success) {
        sessionStorage.setItem('token', response.token)
        setUser(response.user)
        return { success: true }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    try {
      setError('')
      setLoading(true)
      const response = await authService.register(name, email, password)
      
      if (response.success) {
        sessionStorage.setItem('token', response.token)
        setUser(response.user)
        return { success: true }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    setUser(null)
    setError('')
  }

  const clearError = () => {
    setError('')
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 