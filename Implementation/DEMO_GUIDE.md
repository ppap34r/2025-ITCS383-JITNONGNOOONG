# FoodExpress - Food Delivery Platform Demo

## Overview
A complete food delivery platform frontend demo with four user roles: Customer, Restaurant, Rider, and Admin.

## User Roles & Access

### 1. **Customer Portal**
**Entry Point:** Landing page → "Customer" → Login/Register

**Features:**
- **Registration:** Complete form with personal info, address, and payment details
- **Login:** Email/password + OTP authentication (any 6-digit code works in demo)
- **Restaurant Discovery:** Browse restaurants with filters for cuisine type and distance
- **Menu Ordering:** View restaurant menus, add items to cart with quantity selection
- **Checkout:** Review cart, select payment method (Credit Card or QR Code)
- **Order Tracking:** Real-time order status updates
- **Rider Rating:** Rate riders on politeness and speed after delivery

**Demo Login:**
- Email: any email
- Password: any password
- OTP: any 6-digit code

---

### 2. **Restaurant Portal**
**Entry Point:** Landing page → "Restaurant"

**Features:**
- **Dashboard:** View pending orders, revenue, and quick stats
- **Order Management:** Accept/update order status (pending → preparing → ready)
- **Menu Management:** Add, edit, delete menu items with pricing
- **Promotions:** Create restaurant-specific discount promotions

**Mock Restaurant:** Bangkok Street Food (REST001)

---

### 3. **Rider Portal**
**Entry Point:** Landing page → "Rider"

**Features:**
- **Dashboard:** View available orders nearby and daily earnings
- **Order Acceptance:** Accept delivery orders from restaurants
- **Delivery Tracking:** View customer address and order details
- **Delivery Completion:** Mark orders as completed

**Mock Rider:** Mike Chen (RIDER001)
**Earnings:** ฿50 per delivery

---

### 4. **Admin Portal**
**Entry Point:** Landing page → "Admin"

**Features:**
- **Dashboard:** Platform-wide analytics and revenue tracking
  - Daily/Monthly revenue with charts
  - Active users, restaurants, and riders
  - Commission rate (10%)
- **Account Management:**
  - Enable/disable customer and restaurant accounts
  - Delete accounts to prevent scams
  - Search and filter accounts
- **System Promotions:**
  - Create platform-wide discount codes
  - Set target groups (All Users, New Users, VIP)
  - Track promotion usage

---

## Key Features Demonstrated

### Security & Authentication
- ✅ Multi-factor authentication (Email + OTP)
- ✅ Password expiry reminder (monthly update requirement)
- ✅ Account enable/disable controls

### Customer Experience
- ✅ Restaurant filters (cuisine, distance)
- ✅ Multiple payment methods (Credit Card, QR Code/PromptPay)
- ✅ Real-time order tracking
- ✅ Rider rating system (politeness + speed)

### Restaurant Management
- ✅ Order status updates
- ✅ Menu CRUD operations
- ✅ Promotion creation

### Rider Operations
- ✅ Nearby order discovery
- ✅ Order acceptance workflow
- ✅ Customer address access
- ✅ Delivery confirmation

### Administration
- ✅ Revenue analytics with charts
- ✅ Account governance (enable/disable/delete)
- ✅ Platform-wide promotions
- ✅ 10% commission tracking

---

## Mock Data

### Restaurants
- Bangkok Street Food (Thai) - 0.8 km
- Sushi Master (Japanese) - 1.2 km
- Pizza Paradise (Western) - 2.5 km
- Burger Bistro (Western) - 0.5 km

### Orders
- Pre-loaded with 2 sample orders in different stages
- New orders created during checkout

### Commission
- Platform takes 10% commission on all orders
- Displayed in customer checkout and admin dashboard

---

## Technology Stack
- **Frontend:** React + TypeScript
- **Routing:** React Router v7 (Data mode)
- **UI:** Shadcn/ui components + Tailwind CSS
- **State:** React Context API
- **Charts:** Recharts
- **Forms:** React Hook Form compatible
- **Icons:** Lucide React

---

## Demo Notes

1. **No Backend:** All data is stored in React state (resets on page refresh)
2. **Mock Authentication:** Any credentials work for login
3. **OTP:** Any 6-digit code is accepted
4. **Images:** Real photos from Unsplash
5. **Commission:** Automatically calculated at 10% in checkout

---

## Future Enhancement Suggestions

To make this production-ready with Java backend:

1. **Backend API:** Spring Boot REST APIs for all operations
2. **Database:** PostgreSQL for persistent data storage
3. **Authentication:** JWT tokens + SMS gateway for real OTP
4. **Payment Integration:** Stripe/PayPal for credit cards, PromptPay API
5. **Real-time Updates:** WebSocket for order status notifications
6. **Maps Integration:** Google Maps API for restaurant discovery and rider navigation
7. **Mobile Apps:** React Native or native iOS/Android development
8. **Scalability:** Kubernetes, load balancing, CDN for 10M+ users
