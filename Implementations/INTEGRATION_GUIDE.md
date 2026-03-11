# Frontend-Backend Integration Guide

## Quick Start

### Prerequisites
- Backend running: `http://localhost:8080/api`
- Frontend (Vite): `http://localhost:5173`
- MySQL database setup

### Step 1: Update Frontend API Configuration
Edit `Implementation/src/api.js`:

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // ← Changed from http://localhost:4000
  timeout: 5000,
})

export default api
```

### Step 2: Update Checkout Component
Replace `Implementation/src/pages/customer/Checkout.jsx` with:

```jsx
import React, { useState, useRef } from 'react'
import { useCart } from '../../contexts/CartContext'
import api from '../../api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')
  const [qrCode, setQrCode] = useState(null)
  const [verificationPaymentId, setVerificationPaymentId] = useState(null)
  const [bankDetails, setBankDetails] = useState(null)

  async function handlePayment(e) {
    e.preventDefault()
    if (!user) return alert('Please login to checkout')
    
    setProcessing(true)
    
    try {
      // Step 1: Create order
      const orderRes = await api.post('/orders', {
        customerId: user.id,
        items: items.map(it => ({ name: it.name, price: it.price })),
        totalAmount: total,
        deliveryAddress: user.address || 'Default Address',
        status: 'CONFIRMED'
      })
      
      const orderId = orderRes.data.data.id
      console.log('Order created:', orderId)
      
      // Step 2: Initiate payment based on method
      let paymentRes
      
      if (paymentMethod === 'CREDIT_CARD') {
        paymentRes = await api.post('/payments/initiate', {
          orderId: orderId,
          amount: total,
          paymentMethod: 'CREDIT_CARD',
          provider: 'STRIPE',
          cardNumber: document.getElementById('cardNumber').value,
          cardholderName: document.getElementById('cardholderName').value,
          expiryMonth: document.getElementById('expiryMonth').value,
          expiryYear: document.getElementById('expiryYear').value,
          cvc: document.getElementById('cvc').value
        })
        
        const payment = paymentRes.data.data
        console.log('Payment response:', payment)
        
        if (payment.status === 'VERIFIED' || payment.status === 'COMPLETED') {
          clearCart()
          alert('Payment successful! Your order is confirmed.')
          navigate('/customer')
        } else {
          alert('Payment verification pending. Please wait...')
          // Poll for verification
          pollPaymentStatus(payment.id, orderId)
        }
        
      } else if (paymentMethod === 'PROMPTPAY') {
        paymentRes = await api.post(`/payments/${orderId}/promptpay`, null, {
          params: { restaurantPhone: '0892020990' }
        })
        
        const payment = paymentRes.data.data
        if (payment.qrCodeData) {
          setQrCode(payment.qrCodeData)
          setVerificationPaymentId(payment.id)
          console.log('PromptPay QR generated, polling for payment...')
          
          // Start polling verification
          pollPaymentStatus(payment.id, orderId)
        }
        
      } else if (paymentMethod === 'BANK_TRANSFER') {
        paymentRes = await api.post('/payments/initiate', {
          orderId: orderId,
          amount: total,
          paymentMethod: 'BANK_TRANSFER',
          provider: 'STRIPE'
        })
        
        const payment = paymentRes.data.data
        setBankDetails({
          reference: payment.bankReferenceNumber,
          account: 'Thai Bank, Account: 123-456-789'
        })
        setVerificationPaymentId(payment.id)
        console.log('Bank transfer initiated, polling for payment...')
        
        // Start polling
        pollPaymentStatus(payment.id, orderId)
      }
      
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Checkout failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setProcessing(false)
    }
  }

  async function pollPaymentStatus(paymentId, orderId) {
    console.log(`Starting to poll payment status for paymentId: ${paymentId}`)
    
    const maxAttempts = 120 // Poll for up to 10 minutes
    let attempts = 0
    
    const interval = setInterval(async () => {
      attempts++
      console.log(`Poll attempt ${attempts}/${maxAttempts}`)
      
      try {
        const res = await api.get(`/payments/${paymentId}/verify`)
        const payment = res.data.data
        
        console.log('Payment status:', payment.status)
        
        if (payment.status === 'COMPLETED' || payment.status === 'VERIFIED') {
          clearInterval(interval)
          setQrCode(null)
          setBankDetails(null)
          clearCart()
          alert('Payment confirmed successfully!')
          navigate('/customer')
        } else if (payment.status === 'FAILED') {
          clearInterval(interval)
          alert('Payment failed!')
          setQrCode(null)
          setBankDetails(null)
        }
        
      } catch (err) {
        console.error('Poll error:', err)
      }
      
      // Stop polling after max attempts
      if (attempts >= maxAttempts) {
        clearInterval(interval)
        alert('Payment verification timeout. Please check your payment status.')
      }
    }, 3000) // Poll every 3 seconds
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {!qrCode && !bankDetails && (
        <>
          <div className="order-summary card">
            <h3>Order Summary</h3>
            <div><strong>Items:</strong> {items.length}</div>
            <div><strong>Total:</strong> ${total.toFixed(2)}</div>
            {items.map((item, i) => (
              <div key={i} className="muted">{item.name} - ${item.price.toFixed(2)}</div>
            ))}
          </div>

          <form onSubmit={handlePayment} className="payment-form card">
            <h3>Payment Method</h3>
            
            <div className="payment-options">
              <label className="radio-option">
                <input 
                  type="radio" 
                  value="CREDIT_CARD" 
                  checked={paymentMethod === 'CREDIT_CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                Credit Card (Stripe)
              </label>
              
              <label className="radio-option">
                <input 
                  type="radio" 
                  value="PROMPTPAY" 
                  checked={paymentMethod === 'PROMPTPAY'}
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                PromptPay QR Code
              </label>
              
              <label className="radio-option">
                <input 
                  type="radio" 
                  value="BANK_TRANSFER" 
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                Bank Transfer
              </label>
            </div>

            {paymentMethod === 'CREDIT_CARD' && (
              <div className="card-inputs">
                <input 
                  id="cardholderName" 
                  placeholder="Cardholder name" 
                  required 
                />
                <input 
                  id="cardNumber" 
                  placeholder="Card number (4242424242424242 for test)" 
                  required 
                />
                <div className="card-row">
                  <input 
                    id="expiryMonth" 
                    placeholder="MM" 
                    maxLength="2" 
                    required 
                  />
                  <input 
                    id="expiryYear" 
                    placeholder="YY" 
                    maxLength="2" 
                    required 
                  />
                  <input 
                    id="cvc" 
                    placeholder="CVC" 
                    maxLength="3" 
                    required 
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={processing}
              className="btn-pay"
            >
              {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </>
      )}

      {qrCode && (
        <div className="qrcode-container card">
          <h3>Scan PromptPay QR Code</h3>
          <p>Open your banking app and scan this QR code to complete payment:</p>
          <img 
            src={`data:image/png;base64,${qrCode}`} 
            alt="PromptPay QR Code"
            className="qr-image"
          />
          <p className="muted">Waiting for payment confirmation...</p>
          <button onClick={() => { setQrCode(null); setProcessing(false) }}>
            Cancel
          </button>
        </div>
      )}

      {bankDetails && (
        <div className="bank-details card">
          <h3>Bank Transfer Details</h3>
          <p><strong>Account:</strong> {bankDetails.account}</p>
          <p><strong>Reference:</strong> {bankDetails.reference}</p>
          <p className="muted">Please complete transfer within 24 hours using the reference number above.</p>
          <p className="muted">Waiting for payment confirmation...</p>
          <button onClick={() => { setBankDetails(null); setProcessing(false) }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
```

### Step 3: Add Rating Component
Create `Implementation/src/pages/customer/RateRider.jsx`:

```jsx
import React, { useState } from 'react'
import api from '../../api'

export default function RateRider({ orderId, riderId, customerId, onComplete }) {
  const [politeness, setPoliteness] = useState(5)
  const [speed, setSpeed] = useState(5)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submitRating(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/ratings', null, {
        params: { orderId, customerId },
        data: {
          riderId,
          politenessScore: parseInt(politeness),
          speedScore: parseInt(speed),
          review
        }
      })
      
      setSubmitted(true)
      setTimeout(() => onComplete(), 2000)
      
    } catch (err) {
      alert('Rating failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="card success-message">
        <h3>Thank you for rating!</h3>
        <p>Your feedback helps us improve our service.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submitRating} className="rating-form card">
      <h3>Rate Your Delivery</h3>
      
      <div className="rating-section">
        <label><strong>Politeness:</strong> {politeness}/5</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={politeness}
          onChange={(e) => setPoliteness(e.target.value)}
          className="slider"
        />
      </div>
      
      <div className="rating-section">
        <label><strong>Speed:</strong> {speed}/5</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          className="slider"
        />
      </div>
      
      <div className="rating-section">
        <label><strong>Additional Feedback:</strong></label>
        <textarea 
          placeholder="Tell us about your delivery experience..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="3"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="btn-submit"
      >
        {loading ? 'Submitting...' : 'Submit Rating'}
      </button>
    </form>
  )
}
```

### Step 4: Add CSS Styling
Add to `Implementation/src/styles.css`:

```css
/* Checkout Styling */
.checkout-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.order-summary {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.radio-option {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.radio-option:hover {
  background: #f9f9f9;
  border-color: #4CAF50;
}

.radio-option input[type="radio"] {
  margin-right: 10px;
  cursor: pointer;
}

.card-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
  padding: 15px;
  background: #fafafa;
  border-radius: 4px;
}

.card-row {
  display: flex;
  gap: 12px;
}

.card-row input {
  flex: 1;
}

.btn-pay {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.btn-pay:hover {
  background: #45a049;
}

.btn-pay:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.qrcode-container,
.bank-details {
  text-align: center;
  padding: 30px;
}

.qr-image {
  max-width: 300px;
  margin: 20px 0;
  border: 2px solid #ddd;
  padding: 10px;
}

/* Rating Form Styling */
.rating-form {
  max-width: 500px;
  margin: 20px auto;
}

.rating-section {
  margin: 20px 0;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  border: none;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  resize: vertical;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-submit:hover {
  background: #45a049;
}

.success-message {
  text-align: center;
  padding: 30px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  color: #155724;
}
```

## Testing the Integration

### 1. Start Backend
```bash
cd Backend
mvn clean install
mvn spring-boot:run
```

Backend running on: `http://localhost:8080/api`

### 2. Start Frontend
```bash
cd Implementation
npm install
npm run dev
```

Frontend running on: `http://localhost:5173`

### 3. Test Payment Flow
1. Navigate to: http://localhost:5173/customer/checkout
2. Add items to cart
3. Click "Checkout"
4. Select payment method:
   - **Credit Card:** Use test card `4242 4242 4242 4242`, any expiry, any CVC
   - **PromptPay:** Scan generated QR code
   - **Bank:** Transfer using reference number

### 4. Test Rider Functionality
1. As rider: Update location every 10 seconds
   ```bash
   curl -X POST "http://localhost:8080/api/riders/1/location?latitude=13.7563&longitude=100.5018&status=AVAILABLE"
   ```

2. Rider accepts order:
   ```bash
   curl -X POST "http://localhost:8080/api/riders/1/accept-order/123"
   ```

3. Rider confirms delivery:
   ```bash
   curl -X POST "http://localhost:8080/api/riders/1/confirm-delivery/123"
   ```

### 5. Test Rating
1. After delivery, customer rates rider
2. Navigate to order and submit rating
3. Verify rating on rider profile

## Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Ensure backend CorsConfig includes frontend URL
```yaml
cors:
  allowed-origins: http://localhost:5173
```

### Payment Fails
```
Error: "Card declined"
```

**Solution:** Use Stripe test card: `4242 4242 4242 4242`

### QR Code Not Displaying
**Solution:** Check that qrCodeData is base64 PNG
```javascript
img.src = `data:image/png;base64,${payment.qrCodeData}`
```

### Real-time Tracking Not Working
**Solution:** Ensure rider is updating location every 10 seconds with correct format

## Environment Configuration

### Frontend `.env` (Optional)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend `application.yml`
```yaml
server.port: 8080
spring.datasource.url: jdbc:mysql://localhost:3306/mharruengsang
payment.stripe.api-key: sk_test_xxxx
payment.omise.api-key: skey_test_xxxx
```

## Production Deployment

### Frontend
```bash
npm run build
# Serve dist/ with Nginx
```

### Backend
```bash
mvn clean package
java -jar target/food-delivery-backend-1.0.0.jar
```

### Environment Variables
```bash
export STRIPE_API_KEY="sk_live_xxx"
export OMISE_API_KEY="skey_live_xxx"
export JWT_SECRET="your_super_secret_key"
export DATABASE_URL="mysql://prod-host:3306/mharruengsang"
```

---

**Integration complete! Your payment system is now connected to the frontend.**
