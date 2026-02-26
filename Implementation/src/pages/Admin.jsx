import React, { useState, useEffect } from 'react'
import api from '../api'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [users, setUsers] = useState([])
  const [newDiscount, setNewDiscount] = useState({ code: '', amount: '' })

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data))
    api.get('/discounts').then((res) => setDiscounts(res.data))
    api.get('/users').then((res) => setUsers(res.data))
  }, [])

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0)

  function createDiscount() {
    const payload = { code: newDiscount.code, amount: Number(newDiscount.amount) }
    api.post('/discounts', payload).then((res) => setDiscounts((d) => [...d, res.data]))
    setNewDiscount({ code: '', amount: '' })
  }

  function deleteDiscount(id) {
    api.delete(`/discounts/${id}`).then(() => setDiscounts((d) => d.filter((x) => x.id !== id)))
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="card">
        <strong>Revenue:</strong> ${revenue.toFixed(2)}
      </div>

      <h3>Account Management</h3>
      <ul className="list">
        {users.map((u) => (
          <li key={u.id}>{u.name} — {u.email} — <span className="muted">{u.role}</span></li>
        ))}
      </ul>

      <h3>Discount Codes</h3>
      <div className="card">
        <input placeholder="Code" value={newDiscount.code} onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })} />
        <input placeholder="Amount (%)" value={newDiscount.amount} onChange={(e) => setNewDiscount({ ...newDiscount, amount: e.target.value })} />
        <button onClick={createDiscount}>Create Discount</button>
      </div>
      <ul className="list">
        {discounts.map((d) => (
          <li key={d.id}>{d.code} — {d.amount}% <button style={{ marginLeft: 8 }} onClick={() => deleteDiscount(d.id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  )
}
