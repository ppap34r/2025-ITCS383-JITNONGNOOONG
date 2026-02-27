import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fds_cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('fds_cart', JSON.stringify(items))
  }, [items])

  function addItem(item) {
    setItems((s) => [...s, item])
  }

  function removeItem(index) {
    setItems((s) => s.filter((_, i) => i !== index))
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((s, it) => s + (it.price || 0), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

export default CartContext
