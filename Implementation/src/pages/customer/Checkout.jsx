import React, { useState } from 'react'
import { useCart } from '../../contexts/CartContext'
import api from '../../api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)

  async function pay(e) {
    e.preventDefault()
    if (!user) return alert('Please login to checkout')
    setProcessing(true)
    // mock payment: create order in json-server
    try {
      const order = {
        customerId: user.id,
        items: items.map((it) => ({ name: it.name, price: it.price })),
        total,
        status: 'placed',
        createdAt: new Date().toISOString()
      }
      await api.post('/orders', order)
      clearCart()
      alert('Payment successful (mock). Order placed.')
      navigate('/customer')
    } catch (err) { alert('Checkout failed: ' + err.message) }
    setProcessing(false)
  }

  return (
    <div>
      <h2>Checkout</h2>
      <div className="card">
        <div><strong>Items:</strong> {items.length}</div>
        <div><strong>Total:</strong> ${total.toFixed(2)}</div>
      </div>

      <form onSubmit={pay} className="card">
        <h3>Payment (mock)</h3>
        <input placeholder="Cardholder name" required />
        <input placeholder="Card number" required />
        <input placeholder="Expiry" required />
        <input placeholder="CVC" required />
        <button type="submit" disabled={processing}>Pay ${total.toFixed(2)}</button>
      </form>
    </div>
  )
}
