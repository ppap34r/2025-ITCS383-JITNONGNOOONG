# Backend-Frontend Connection Implementation

## Summary of Changes

This implementation establishes a complete connection between the React frontend and Spring Boot backend for the MharRuengSang food delivery platform.

---

## ✅ What Was Fixed

### 1. Backend (Spring Boot)

#### Added CORS Configuration
- **File:** `Implementations/Backend/api-gateway/src/main/java/com/itcs383/gateway/config/CorsConfig.java`
- **Purpose:** Allows frontend (localhost:5173) to communicate with backend (localhost:8080)
- **Features:**
  - Supports all localhost ports for development
  - Configures allowed methods (GET, POST, PUT, DELETE, etc.)
  - Enables credentials (cookies, auth tokens)
  - Sets appropriate headers for security

### 2. Frontend (React + TypeScript)

#### Created API Configuration
- **File:** `Implementation/src/app/config/api.config.ts`
- **Purpose:** Centralized API endpoint configuration
- **Features:**
  - Environment-based API URLs
  - Complete endpoint mapping for all services
  - Easy to update and maintain

#### Created API Client with Interceptors
- **File:** `Implementation/src/app/services/apiClient.ts`
- **Purpose:** Axios-based HTTP client with automatic error handling
- **Features:**
  - Automatic JWT token injection
  - Request/response logging (dev mode)
  - Token refresh on 401 errors
  - Consistent error handling
  - TypeScript type safety

#### Created Service Layers
- **Restaurant Service:** `Implementation/src/app/services/restaurant.service.ts`
  - Get all restaurants (paginated)
  - Search restaurants with filters
  - Get restaurant by ID
  - Get restaurants by cuisine
  - Get top-rated restaurants
  - Get restaurant menu

- **Order Service:** `Implementation/src/app/services/order.service.ts`
  - Create new order
  - Get order by ID/number
  - Get customer/restaurant orders
  - Update order status
  - Cancel order
  - Helper methods for status display

#### Environment Configuration
- **Files:**
  - `.env.development` - Development settings
  - `.env.production` - Production settings
  - `.env.example` - Template for local setup
- **Purpose:** Environment-specific API URLs and feature flags

#### Updated Vite Configuration
- **File:** `Implementation/vite.config.ts`
- **Purpose:** Proxy configuration for development
- **Features:**
  - Proxies `/api` requests to backend
  - Avoids CORS issues in development
  - WebSocket support for real-time features

#### Added Example Component
- **File:** `Implementation/src/app/examples/RestaurantListApi.tsx`
- **Purpose:** Demonstrates API usage with best practices
- **Features:**
  - Loading states
  - Error handling
  - Search functionality
  - Pagination
  - Filter by cuisine

---

## 🚀 Quick Start

### Prerequisites

```bash
# Java 17 or higher
java -version

# Node.js 18 or higher
node --version

# Docker and Docker Compose
docker --version
docker-compose --version
```

### 1. Start Backend

```bash
cd Implementations/Backend

# Start all services with Docker Compose
docker-compose up -d

# Wait for services to start (about 30 seconds)
# Check health
curl http://localhost:8080/actuator/health
```

### 2. Start Frontend

```bash
cd Implementation

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **API Gateway Health:** http://localhost:8080/actuator/health

---

## 📝 Usage Examples

### Example 1: Fetch Restaurants

```typescript
import { restaurantService } from '@/app/services';

// Get all restaurants (first page, 20 items)
const restaurants = await restaurantService.getAllRestaurants(0, 20);
console.log(restaurants.content); // Array of restaurants
```

### Example 2: Search Restaurants

```typescript
import { restaurantService } from '@/app/services';

// Search with filters
const results = await restaurantService.searchRestaurants({
  searchTerm: 'sushi',
  cuisineType: 'Japanese',
  minRating: 4.0,
  page: 0,
  size: 10,
});
```

### Example 3: Create Order

```typescript
import { orderService, PaymentMethod } from '@/app/services';

const order = await orderService.createOrder({
  customerId: 'CUST001',
  restaurantId: 'REST001',
  deliveryAddress: {
    street: '123 Main St',
    city: 'Bangkok',
    postalCode: '10100',
    latitude: 13.7563,
    longitude: 100.5018,
  },
  items: [
    {
      menuItemId: 'ITEM001',
      quantity: 2,
      specialInstructions: 'No spicy',
    },
  ],
  paymentMethod: PaymentMethod.CREDIT_CARD,
});

console.log('Order created:', order.orderNumber);
```

### Example 4: Using in React Component

```typescript
import { useState, useEffect } from 'react';
import { restaurantService } from '@/app/services';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restaurantService.getAllRestaurants();
        setRestaurants(response.content);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {restaurants.map(restaurant => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

---

## 📚 Available API Endpoints

### Restaurant Service (`/api/v1/restaurants`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all restaurants (paginated) |
| GET | `/{id}` | Get restaurant by ID |
| GET | `/search` | Search with filters |
| GET | `/cuisine/{type}` | Filter by cuisine |
| GET | `/top-rated` | Get top rated |
| GET | `/{id}/menu` | Get menu items |

### Order Service (`/api/v1/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new order |
| GET | `/{id}` | Get order by ID |
| GET | `/number/{orderNumber}` | Get by order number |
| GET | `/customer/{id}` | Get customer orders |
| GET | `/restaurant/{id}` | Get restaurant orders |
| PUT | `/{id}/status` | Update status |
| DELETE | `/{id}` | Cancel order |

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the `Implementation` directory:

```bash
# API URL
VITE_API_BASE_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_DEBUG=true
```

### Backend Ports

- **API Gateway:** 8080
- **Order Service:** 8081
- **Restaurant Service:** 8082
- **PostgreSQL:** 5432
- **Redis:** 6379

---

## 🐛 Troubleshooting

### Problem: Cannot connect to backend

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8080/actuator/health

# If not, start docker-compose
cd Implementations/Backend
docker-compose up -d

# Check logs
docker-compose logs api-gateway
```

### Problem: CORS errors

**Solution:**
1. Restart Vite dev server: `npm run dev`
2. Clear browser cache
3. Verify proxy in `vite.config.ts`

### Problem: 404 Not Found

**Solution:**
1. Verify service is running: `docker-compose ps`
2. Check service is registered with Eureka
3. Review API Gateway routes in `application.yml`

### Problem: TypeScript errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart TypeScript server in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

---

## 📂 File Structure

```
Implementations/Backend/
├── api-gateway/
│   └── src/main/java/com/itcs383/gateway/
│       └── config/
│           └── CorsConfig.java          ← CORS configuration

Implementation/
├── src/app/
│   ├── config/
│   │   └── api.config.ts                ← API endpoints
│   ├── services/
│   │   ├── apiClient.ts                 ← HTTP client
│   │   ├── restaurant.service.ts        ← Restaurant API
│   │   ├── order.service.ts             ← Order API
│   │   └── index.ts                     ← Service exports
│   └── examples/
│       └── RestaurantListApi.tsx        ← Usage example
├── .env.development                     ← Dev environment
├── .env.production                      ← Prod environment
├── .env.example                         ← Template
├── vite.config.ts                       ← Vite + Proxy config
└── package.json                         ← Added axios
```

---

## 📖 Documentation

- **Connection Guide:** `/FRONTEND_BACKEND_CONNECTION.md` (detailed setup)
- **API Reference:** `/Implementations/Backend/API_REFERENCE.md` (backend endpoints)
- **Architecture:** `/ARCHITECTURE.md` (system design)

---

## ✨ Features

### ✅ Implemented
- ✅ CORS configuration
- ✅ API client with interceptors
- ✅ Restaurant service
- ✅ Order service
- ✅ Environment configuration
- ✅ Vite proxy setup
- ✅ TypeScript types
- ✅ Error handling
- ✅ Token management
- ✅ Example component

### 🚧 Next Steps
- [ ] Implement authentication service
- [ ] Add payment service integration
- [ ] Create rider service
- [ ] Add customer service
- [ ] Implement WebSocket for real-time updates
- [ ] Add unit tests for services
- [ ] Create integration tests

---

## 🤝 Contributing

When adding new API endpoints:

1. Add endpoint to `api.config.ts`
2. Create/update service in `services/` directory
3. Export types and service in `services/index.ts`
4. Update API documentation
5. Add usage examples

---

## 📞 Support

If you encounter issues:

1. Check service health: `docker-compose ps`
2. Review logs: `docker-compose logs [service-name]`
3. Consult `/FRONTEND_BACKEND_CONNECTION.md`
4. Check backend API reference

---

**Status:** ✅ Ready for Development

**Last Updated:** March 10, 2026
