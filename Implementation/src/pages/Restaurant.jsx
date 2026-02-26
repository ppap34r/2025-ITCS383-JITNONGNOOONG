import React, { useState, useEffect } from 'react'
import api from '../api'

export default function Restaurant() {
  const [menu, setMenu] = useState([])
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' })
  const [orders, setOrders] = useState([])
  const [promotions, setPromotions] = useState([])
  const [newPromo, setNewPromo] = useState({ title: '', discount: '' })

  useEffect(() => {
    // load restaurant's menu (mock: restaurantId 1)
    api.get('/menus?restaurantId=1').then((res) => setMenu(res.data))
    api.get('/orders?restaurantId=1').then((res) => setOrders(res.data))
    api.get('/promotions?restaurantId=1').then((res) => setPromotions(res.data))
  }, [])

  function addItem() {
    const item = { ...newItem, restaurantId: 1, price: Number(newItem.price) }
    api.post('/menus', item).then((res) => setMenu((m) => [...m, res.data]))
    setNewItem({ name: '', price: '', description: '' })
  }

  function addPromotion() {
    const promo = { ...newPromo, restaurantId: 1, discount: Number(newPromo.discount) }
    api.post('/promotions', promo).then((res) => setPromotions((p) => [...p, res.data]))
    setNewPromo({ title: '', discount: '' })
  }

  function updateOrderStatus(orderId, status) {
    api.patch(`/orders/${orderId}`, { status }).then((res) => {
      setOrders((o) => o.map((ord) => (ord.id === orderId ? res.data : ord)))
    })
  }

  return (
    <div>
      <h2>Menu Management</h2>
      <div className="card">
        <h3>Add Menu Item</h3>
        <input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <input placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
        <input placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
        <button onClick={addItem}>Add</button>
      </div>

      <h3>Current Menu</h3>
      <ul className="list">
        {menu.map((m) => (
          <li key={m.id}>
            <div>{m.name} — ${m.price}</div>
            <div className="muted">{m.description}</div>
          </li>
        ))}
      </ul>

      <h3>Incoming Orders</h3>
      <ul className="list">
        {orders.map((o) => (
          <li key={o.id}>
            <div>Order #{o.id} — ${o.total} — <span className="muted">{o.status}</span></div>
            <div className="muted">Placed: {o.createdAt}</div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => updateOrderStatus(o.id, 'preparing')}>Preparing</button>
              <button style={{ marginLeft: 6 }} onClick={() => updateOrderStatus(o.id, 'delivered')}>Delivered</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Promotions</h3>
      <div className="card">
        <input placeholder="Title" value={newPromo.title} onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })} />
        <input placeholder="Discount (%)" value={newPromo.discount} onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })} />
        <button onClick={addPromotion}>Add Promotion</button>
      </div>

      <ul className="list">
        {promotions.map((p) => (
          <li key={p.id}>{p.title} — {p.discount}%</li>
        ))}
      </ul>
    </div>
  )
}
