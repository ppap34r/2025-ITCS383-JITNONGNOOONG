import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import api from '../api'
import Register from './customer/Register'
import Login from './customer/Login'
import Cart from './customer/Cart'
import Checkout from './customer/Checkout'
import RestaurantDetail from './customer/RestaurantDetail'

function Browse() {
  const [restaurants, setRestaurants] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    api.get('/restaurants').then((res) => setRestaurants(res.data))
  }, [])

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div>
      <h2>Browse Restaurants</h2>
      <input aria-label="Search restaurants" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="list">
        {filtered.map((r) => (
          <li key={r.id}>
            <Link to={`restaurant/${r.id}`}>{r.name}</Link>
            <div className="muted">{r.cuisine}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Customer() {
  return (
    <Routes>
      <Route path="/" element={<Browse />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
    </Routes>
  )
}
