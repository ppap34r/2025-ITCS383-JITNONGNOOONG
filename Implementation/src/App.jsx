import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Customer from './pages/Customer'
import Restaurant from './pages/Restaurant'
import Admin from './pages/Admin'
import { useAuth } from './contexts/AuthContext'
import { useCart } from './contexts/CartContext'

export default function App() {
  const { user, logout } = useAuth()
  const { items } = useCart()

  return (
    <div className="app">
      <header className="topbar">
        <h1>Food Delivery System</h1>
        <nav>
          <Link to="/customer">Customer</Link>
          <Link to="/restaurant">Restaurant</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/customer/cart">Cart ({items.length})</Link>
          {user ? (
            <>
              <span style={{ marginLeft: 12 }}>Hi, {user.name}</span>
              <button style={{ marginLeft: 8 }} onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/customer/login">Login</Link>
              <Link to="/customer/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/customer" replace />} />
          <Route path="/customer/*" element={<Customer />} />
          <Route path="/restaurant/*" element={<Restaurant />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </main>

      <footer className="footer">© Food Delivery System</footer>
    </div>
  )
}
