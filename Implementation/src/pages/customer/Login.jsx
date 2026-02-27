import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    try {
      await login(form)
      navigate('/customer')
    } catch (err) { alert('Login failed: ' + err.message) }
  }

  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
