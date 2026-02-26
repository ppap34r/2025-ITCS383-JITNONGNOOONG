import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api'
import { useCart } from '../../contexts/CartContext'

export default function RestaurantDetail() {
  const { id } = useParams()
  const [menu, setMenu] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    api.get(`/restaurants/${id}`).then((r) => setRestaurant(r.data))
    api.get(`/menus?restaurantId=${id}`).then((res) => setMenu(res.data))
  }, [id])

  if (!restaurant) return <div>Loading...</div>

  return (
    <div>
      <h2>{restaurant.name}</h2>
      <div className="muted">{restaurant.cuisine}</div>
      <h3>Menu</h3>
      <ul className="list">
        {menu.map((m) => (
          <li key={m.id}>
            <div>{m.name} — ${m.price}</div>
            <div className="muted">{m.description}</div>
            <button onClick={() => addItem(m)}>Add to cart</button>
          </li>
        ))}
      </ul>
      <RatingForm restaurantId={id} />
    </div>
  )
}

function RatingForm({ restaurantId }) {
  const [score, setScore] = React.useState(5)
  const [comment, setComment] = React.useState('')

  async function submit() {
    try {
      await api.post('/ratings', { restaurantId: Number(restaurantId), score, comment, createdAt: new Date().toISOString() })
      alert('Thanks for your rating!')
      setComment('')
      setScore(5)
    } catch (err) { alert('Rating failed: ' + err.message) }
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h4>Rate this restaurant</h4>
      <label>Score: <select value={score} onChange={(e) => setScore(Number(e.target.value))}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
      <textarea placeholder="Comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%', marginTop: 8 }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={submit}>Submit Rating</button>
      </div>
    </div>
  )
}
