# Frontend-Backend Connection Guide

## Overview

This guide explains how to connect the React frontend (port 5173) with the Spring Boot backend (port 8080) for the MharRuengSang food delivery platform.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MHAR RUENG SANG PLATFORM                  │
└─────────────────────────────────────────────────────────────┘

Frontend (React + TypeScript)              Backend (Spring Boot)
┌──────────────────────────┐              ┌──────────────────────────┐
│  http://localhost:5173   │              │  http://localhost:8080   │
│                          │              │                          │
│  ┌────────────────────┐ │              │  ┌────────────────────┐ │
│  │  React Components  │ │              │  │   API Gateway      │ │
│  └─────────┬──────────┘ │              │  │   (Port 8080)      │ │
│            │            │              │  └─────────┬──────────┘ │
│            ▼            │              │            │            │
│  ┌────────────────────┐ │   HTTP/JSON  │  ┌─────────┴──────────┐ │
│  │  API Services      │◄┼─────────────►│  │  Microservices     │ │
│  │  - Restaurant      │ │              │  │  - Restaurant      │ │
│  │  - Order           │ │              │  │  - Order           │ │
│  │  - Payment         │ │              │  │  - Payment         │ │
│  └────────────────────┘ │              │  │  - Auth            │ │
│                          │              │  └────────────────────┘ │
└──────────────────────────┘              └──────────────────────────┘
```

---

## Setup Instructions

### 1. Backend Setup

#### Start Backend Services

```bash
cd Implementations/Backend

# Start all services with Docker Compose
docker-compose up -d

# Or start individual services for development
# 1. Start PostgreSQL
docker-compose up -d postgres

# 2. Start Redis
docker-compose up -d redis

# 3. Build and run API Gateway
cd api-gateway
mvn clean install
mvn spring-boot:run

# 4. Build and run Order Service
cd ../order-service
mvn clean install
mvn spring-boot:run

# 5. Build and run Restaurant Service
cd ../restaurant-service
mvn clean install
mvn spring-boot:run
```

#### Verify Backend Services

```bash
# Check API Gateway health
curl http://localhost:8080/actuator/health

# Check Order Service
curl http://localhost:8080/api/v1/orders

# Check Restaurant Service
curl http://localhost:8080/api/v1/restaurants
```

### 2. Frontend Setup

#### Install Dependencies

```bash
cd Implementations/Frontend

# Install dependencies
npm install

# Install axios for HTTP requests (if not already installed)
npm install axios
```

#### Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local if needed (defaults should work for local development)
# VITE_API_BASE_URL=http://localhost:8080
```

#### Start Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## API Service Usage

### Importing Services

```typescript
// Import specific services
import { restaurantService, orderService } from '@/app/services';

// Import types
import type { Restaurant, Order, OrderStatus } from '@/app/services';
```

### Example: Fetching Restaurants

```typescript
import { restaurantService } from '@/app/services';
import { useState, useEffect } from 'react';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantService.getAllRestaurants(0, 20);
        setRestaurants(response.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {restaurants.map(restaurant => (
        <div key={restaurant.id}>{restaurant.name}</div>
      ))}
    </div>
  );
}
```

### Example: Creating an Order

```typescript
import { orderService, PaymentMethod } from '@/app/services';

async function createOrder() {
  try {
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
  } catch (error) {
    console.error('Failed to create order:', error);
  }
}
```

### Example: Search Restaurants

```typescript
import { restaurantService } from '@/app/services';

async function searchRestaurants() {
  try {
    const results = await restaurantService.searchRestaurants({
      searchTerm: 'sushi',
      cuisineType: 'Japanese',
      minRating: 4.0,
      latitude: 13.7563,
      longitude: 100.5018,
      page: 0,
      size: 10,
    });

    console.log(`Found ${results.totalElements} restaurants`);
    return results.content;
  } catch (error) {
    console.error('Search failed:', error);
  }
}
```

---

## API Endpoints

### Restaurant Service

Base URL: `http://localhost:8080/api/v1/restaurants`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all restaurants (paginated) |
| GET | `/{id}` | Get restaurant by ID |
| GET | `/search` | Search restaurants with filters |
| GET | `/cuisine/{type}` | Filter by cuisine type |
| GET | `/top-rated` | Get top rated restaurants |
| GET | `/{id}/menu` | Get restaurant menu |

### Order Service

Base URL: `http://localhost:8080/api/v1/orders`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new order |
| GET | `/{id}` | Get order by ID |
| GET | `/number/{orderNumber}` | Get order by number |
| GET | `/customer/{customerId}` | Get customer orders |
| GET | `/restaurant/{restaurantId}` | Get restaurant orders |
| PUT | `/{id}/status` | Update order status |
| DELETE | `/{id}` | Cancel order |

---

## CORS Configuration

CORS is configured in two places for redundancy:

### 1. API Gateway (Primary)

Location: `Implementations/Backend/api-gateway/src/main/java/com/itcs383/gateway/config/CorsConfig.java`

```java
// Allowed origins
- http://localhost:*        (All localhost ports)
- http://127.0.0.1:*       (All 127.0.0.1 ports)
- https://mhar-rueng-sang.com

// Allowed methods
GET, POST, PUT, DELETE, PATCH, OPTIONS

// Allowed headers
Authorization, Content-Type, X-User-Id, etc.
```

### 2. Vite Proxy (Development)

Location: `Implementation/vite.config.ts`

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

---

## Troubleshooting

### Issue: Cannot connect to backend

**Symptom:** Network errors, "Connection refused"

**Solutions:**
1. Verify backend is running: `curl http://localhost:8080/actuator/health`
2. Check docker containers: `docker-compose ps`
3. Check API Gateway logs: `docker logs mhar-api-gateway`
4. Ensure port 8080 is not blocked by firewall

### Issue: CORS errors

**Symptom:** "Access-Control-Allow-Origin" errors in browser console

**Solutions:**
1. Clear browser cache and cookies
2. Restart Vite dev server: `npm run dev`
3. Verify CORS configuration in `CorsConfig.java`
4. Check if proxy is configured in `vite.config.ts`

### Issue: 401 Unauthorized

**Symptom:** API returns 401 status code

**Solutions:**
1. Implement authentication endpoints
2. Store JWT token in localStorage after login
3. Token is automatically added to requests by `apiClient.ts`

### Issue: 404 Not Found

**Symptom:** API endpoints return 404

**Solutions:**
1. Verify service is registered with Eureka
2. Check API Gateway routing configuration in `application.yml`
3. Ensure service is running: `docker-compose ps`

### Issue: Slow response times

**Symptom:** API calls take too long

**Solutions:**
1. Check Redis is running: `docker-compose ps redis`
2. Verify database connection pool settings
3. Monitor service logs for performance issues

---

## Development Workflow

### 1. Standard Development

```bash
# Terminal 1: Backend
cd Implementations/Backend
docker-compose up

# Terminal 2: Frontend
cd Implementations/Frontend
npm run dev
```

### 2. Development with Hot Reload

```bash
# Backend: Run services individually with spring-boot-devtools
cd Implementations/Backend/api-gateway
mvn spring-boot:run

# Frontend: Already has hot reload
cd Implementations/Frontend
npm run dev
```

### 3. Full Stack with Mock Data

If backend is not ready, you can enable mock data:

```bash
# Edit .env.local
VITE_ENABLE_MOCK_DATA=true
```

---

## Environment Variables

### Frontend (.env.local)

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_ANALYTICS=false

# Debug Mode
VITE_DEBUG=true
```

### Backend (application.yml)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mhar_main
    username: mhar_user
    password: mhar_password

  redis:
    host: localhost
    port: 6379
```

---

## Testing the Connection

### 1. Browser Test

```javascript
// Open browser console on http://localhost:5173
// Run this command:

fetch('http://localhost:8080/api/v1/restaurants')
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

### 2. cURL Test

```bash
# Test API Gateway
curl http://localhost:8080/actuator/health

# Test Restaurant Service
curl http://localhost:8080/api/v1/restaurants?page=0&size=5

# Test Order Service  
curl http://localhost:8080/api/v1/orders
```

### 3. Network Tab

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Interact with the application
4. Check for API requests in the network log
5. Verify status codes (200 = success, 4xx/5xx = error)

---

## Security Considerations

### 1. Authentication

- JWT tokens stored in `localStorage`
- Tokens automatically added to requests via interceptors
- Refresh tokens handled automatically on 401 errors

### 2. HTTPS in Production

```typescript
// Production environment (.env.production)
VITE_API_BASE_URL=https://api.mhar-rueng-sang.com
```

### 3. API Keys

Store sensitive keys in environment variables:

```bash
# Never commit these to Git
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_PAYMENT_GATEWAY_KEY=your_key_here
```

---

## Production Deployment

### Build Frontend

```bash
cd Implementations/Frontend
npm run build

# Test production build locally
npm run preview
```

### Deploy Architecture

```
Internet
    │
    ▼
[Load Balancer / CDN]
    │
    ├──> [Frontend] (Static Files on S3/CloudFront)
    │
    └──> [API Gateway] http://api.mhar-rueng-sang.com
            │
            ├──> [Order Service]
            ├──> [Restaurant Service]
            ├──> [Payment Service]
            └──> [Auth Service]
```

---

## Additional Resources

- **Backend API Documentation:** `/Implementations/Backend/API_REFERENCE.md`
- **Backend Architecture:** `/BACKEND_SUMMARY.md`
- **Frontend Guidelines:** `/Implementations/Frontend/guidelines/Guidelines.md`
- **System Architecture:** `/ARCHITECTURE.md`

---

## Support

If you encounter issues:

1. Check service logs: `docker-compose logs [service-name]`
2. Verify all services are running: `docker-compose ps`
3. Review this connection guide
4. Check API_REFERENCE.md for endpoint details

---

**Last Updated:** March 10, 2026
