import React from 'react'
import { useCart } from '../../contexts/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const { items, removeItem, clearCart, total } = useCart()
  const navigate = useNavigate()

  return (
    <div>
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <div className="card">Your cart is empty.</div>
      ) : (
        <div>
          <ul className="list">
            {items.map((it, i) => (
              <li key={i}>
                <div>{it.name} — ${it.price}</div>
                <div className="muted">{it.description}</div>
                <button onClick={() => removeItem(i)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="card">
            <strong>Total:</strong> ${total.toFixed(2)}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => navigate('/customer/checkout')}>Checkout</button>
              <button style={{ marginLeft: 8 }} onClick={clearCart}>Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
