import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fds_user')) } catch { return null }
  })

  useEffect(() => {
    localStorage.setItem('fds_user', JSON.stringify(user))
  }, [user])

  async function register(payload) {
    const res = await api.post('/users', payload)
    setUser(res.data)
    return res.data
  }

  async function login({ email, password }) {
    // mock login: look up user by email and password
    const res = await api.get(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
    if (res.data && res.data.length > 0) {
      setUser(res.data[0])
      return res.data[0]
    }
    throw new Error('Invalid credentials')
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('fds_user')
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
