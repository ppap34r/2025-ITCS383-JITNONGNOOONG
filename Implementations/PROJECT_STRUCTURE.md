## 📁 Project Structure

```
2025-ITCS383-MharRuengSang/
├── Implementations/
│   ├── Backend/              ← Spring Boot microservices (Java)
│   │   ├── api-gateway/      ← API Gateway (Port 8080)
│   │   ├── order-service/    ← Order management (Port 8081)
│   │   ├── restaurant-service/ ← Restaurant & Menu (Port 8082)
│   │   ├── common/           ← Shared DTOs and utilities
│   │   └── docker-compose.yml
│   │
│   └── Frontend/             ← React + TypeScript + Vite
│       ├── src/
│       │   ├── app/
│       │   │   ├── pages/    ← Customer, Restaurant, Rider, Admin pages
│       │   │   ├── services/ ← API client services
│       │   │   ├── components/ ← UI components
│       │   │   └── config/   ← API configuration
│       │   └── styles/
│       ├── package.json
│       └── vite.config.ts
│
├── FRONTEND_BACKEND_CONNECTION.md ← Connection setup guide
├── ARCHITECTURE.md                ← System architecture (C4 Model)
├── setup.sh                       ← Automated setup script
└── README.md                      ← This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Docker & Docker Compose** (for services)

### Option 1: Automated Setup (Recommended)

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

### Option 2: Manual Setup

#### Start Backend

```bash
cd Implementations/Backend
docker-compose up -d

# Verify services are running
curl http://localhost:8080/actuator/health
```

#### Start Frontend

```bash
cd Implementations/Frontend
npm install
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080

---

## 📚 Documentation

- **[Frontend-Backend Connection Guide](FRONTEND_BACKEND_CONNECTION.md)** - Complete setup and connection documentation
- **[Backend API Reference](Implementations/Backend/API_REFERENCE.md)** - API endpoints and usage
- **[System Architecture](ARCHITECTURE.md)** - C4 Model diagrams and technical design
- **[Quick Start Guide](QUICK_START.md)** - Getting started quickly

---

## 🏗️ Architecture

The system follows a **microservices architecture**:

### Backend (Spring Boot)
- **API Gateway** - Routes requests, handles CORS, rate limiting
- **Order Service** - Order management and workflow
- **Restaurant Service** - Restaurant and menu management
- **Payment Service** - Payment processing (10% commission)
- **Auth Service** - Authentication and authorization

### Frontend (React + TypeScript)
- **Customer Portal** - Browse restaurants, place orders, track delivery
- **Restaurant Dashboard** - Manage menu, view orders, create promotions
- **Rider App** - Accept deliveries, navigate to customers
- **Admin Panel** - Monitor revenue, manage accounts, system promotions

### Infrastructure
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **Kafka/RabbitMQ** - Event streaming (optional)

---

## 🔧 Development

### Backend Development

```bash
cd Implementations/Backend

# Start specific service
cd order-service
mvn spring-boot:run

# Build all services
mvn clean install
```

### Frontend Development

```bash
cd Implementations/Frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📖 API Endpoints

### Restaurant Service (`/api/v1/restaurants`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all restaurants |
| GET | `/{id}` | Get restaurant by ID |
| GET | `/search` | Search with filters |
| GET | `/cuisine/{type}` | Filter by cuisine |

### Order Service (`/api/v1/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new order |
| GET | `/{id}` | Get order by ID |
| PUT | `/{id}/status` | Update order status |
| DELETE | `/{id}` | Cancel order |

For complete API documentation, see [API_REFERENCE.md](Implementations/Backend/API_REFERENCE.md)

---

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check Docker containers
docker-compose ps

# View logs
docker-compose logs api-gateway
```

### Frontend build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Connection errors
- Verify backend is running: `curl http://localhost:8080/actuator/health`
- Check CORS configuration in `api-gateway/config/CorsConfig.java`
- Review proxy settings in `vite.config.ts`

---

## 👥 Team

- **Backend Team:** Order Service, Restaurant Service, Payment Service
- **Frontend Team:** React UI, API Integration
- **DevOps Team:** Docker, Deployment, CI/CD

---

## 📄 License

This project is for educational purposes as part of ITCS383 course.

---

**Last Updated:** March 10, 2026
