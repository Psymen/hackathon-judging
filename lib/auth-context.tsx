"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, mockAPI } from './mock-data'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to validate credentials
      const users = await mockAPI.getUsers()
      const foundUser = users.find(u => u.email === email)
      
      if (foundUser) {
        // In a real app, we would validate the password here
        setUser(foundUser)
        localStorage.setItem('user', JSON.stringify(foundUser))
        setLoading(false)
        return true
      }
      
      setLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to register the user
      const users = await mockAPI.getUsers()
      const existingUser = users.find(u => u.email === email)
      
      if (existingUser) {
        setLoading(false)
        return false
      }
      
      const newUser = await mockAPI.createUser({
        name,
        email,
        role: 'judge', // Default role for new registrations
        status: 'pending', // New users start as pending
        password: '', // In a real app, this would be hashed
      })
      
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      setLoading(false)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      setLoading(false)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}