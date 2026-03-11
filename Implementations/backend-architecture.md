# MharRuengSang - Backend Architecture Design

## **Microservices Architecture**

### **Core Services (Your Responsibility)**

#### 1. **API Gateway Service** (`mhar-api-gateway`)
- **Port**: 8080
- **Responsibilities**: 
  - Route requests to appropriate microservices
  - Load balancing and circuit breaker patterns
  - Rate limiting (10M concurrent users)
  - Authentication token validation
- **Tech Stack**: Spring Cloud Gateway, Redis (for rate limiting)

#### 2. **Order Service** (`mhar-order-service`)
- **Port**: 8081
- **Responsibilities**: 
  - Create new orders
  - Order status management (PENDING → PREPARING → PICKED_UP → DELIVERED)
  - Order history and tracking
  - Integration with Payment & Restaurant services
- **Database**: PostgreSQL (orders, order_items, order_status_history)

#### 3. **Restaurant Service** (`mhar-restaurant-service`)
- **Port**: 8082
- **Responsibilities**: 
  - Restaurant CRUD operations
  - Menu management (items, categories, pricing)
  - Receive and display incoming orders
  - Restaurant availability and operating hours
- **Database**: PostgreSQL (restaurants, menu_items, categories)

### **Team Services (Coordinated by You)**

#### 4. **Auth Service** (Natkrittar) (`mhar-auth-service`)
- **Port**: 8083
- JWT token generation/validation
- User registration/login
- Role management (CUSTOMER, RESTAURANT, RIDER, ADMIN)

#### 5. **Payment Service** (Pundharee) (`mhar-payment-service`)
- **Port**: 8084
- Payment processing
- Wallet management
- Transaction history

#### 6. **Rider Service** (Pundharee) (`mhar-rider-service`)
- **Port**: 8085
- Rider management
- Delivery assignment and tracking

#### 7. **Notification Service** (`mhar-notification-service`)
- **Port**: 8086
- Push notifications, SMS, Email
- Real-time order updates

---

## **Database Schema Design**

### **Order Service Database**

```sql
-- Orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    rider_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    delivery_address TEXT NOT NULL,
    delivery_latitude DECIMAL(10,8),
    delivery_longitude DECIMAL(11,8),
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id BIGINT NOT NULL,
    menu_item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(8,2) NOT NULL,
    total_price DECIMAL(8,2) NOT NULL,
    special_requests TEXT
);

-- Order status history
CREATE TABLE order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by BIGINT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### **Restaurant Service Database**

```sql
-- Restaurants table
CREATE TABLE restaurants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    cuisine_type VARCHAR(100),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    delivery_fee DECIMAL(8,2) DEFAULT 0.00,
    minimum_order DECIMAL(8,2) DEFAULT 0.00,
    estimated_delivery_time INTEGER DEFAULT 30, -- minutes
    is_active BOOLEAN DEFAULT true,
    opening_time TIME,
    closing_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu categories
CREATE TABLE menu_categories (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Menu items
CREATE TABLE menu_items (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES menu_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(8,2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    preparation_time INTEGER DEFAULT 15, -- minutes
    ingredients TEXT,
    allergens TEXT,
    calories INTEGER,
    spice_level VARCHAR(20), -- MILD, MEDIUM, HOT, VERY_HOT
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine_type);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
```

---

## **API Gateway Routes Configuration**

```yaml
# application.yml for API Gateway
spring:
  cloud:
    gateway:
      routes:
        # Auth Service
        - id: auth-service
          uri: lb://mhar-auth-service
          predicates:
            - Path=/api/v1/auth/**
          filters:
            - StripPrefix=3

        # Order Service
        - id: order-service
          uri: lb://mhar-order-service
          predicates:
            - Path=/api/v1/orders/**
          filters:
            - StripPrefix=3
            - AuthenticationFilter

        # Restaurant Service
        - id: restaurant-service
          uri: lb://mhar-restaurant-service
          predicates:
            - Path=/api/v1/restaurants/**
          filters:
            - StripPrefix=3

        # Payment Service
        - id: payment-service
          uri: lb://mhar-payment-service
          predicates:
            - Path=/api/v1/payments/**
          filters:
            - StripPrefix=3
            - AuthenticationFilter

      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods: "*"
            allowedHeaders: "*"
```

---

## **Scalability Considerations for 10M Users**

### **1. Database Optimization**
- **Read Replicas**: Master-slave configuration for read-heavy operations
- **Sharding**: Partition orders by customer_id or region
- **Connection Pooling**: HikariCP with optimized settings
- **Caching**: Redis for frequent queries (restaurant lists, menu items)

### **2. Service Scaling**
- **Horizontal Scaling**: Multiple instances per service
- **Load Balancing**: Nginx + Spring Cloud LoadBalancer
- **Circuit Breaker**: Resilience4j for fault tolerance
- **Async Processing**: Kafka for order events and notifications

### **3. Performance Patterns**
- **CQRS**: Separate read/write models for orders
- **Event Sourcing**: Track all order state changes
- **Caching Strategy**: Multi-level caching (L1: Local, L2: Redis, L3: Database)
- **CDN**: Static content delivery for restaurant images

---

## **Next Steps**

1. **Set up the project structure** with Maven multi-module setup
2. **Implement API Gateway** with basic routing
3. **Create Order Service** with core entities and repositories
4. **Create Restaurant Service** with menu management
5. **Set up service discovery** with Eureka
6. **Implement inter-service communication** with OpenFeign
7. **Add monitoring** with Micrometer and Actuator

Would you like me to start with any specific service implementation or help you set up the Maven multi-module project structure?
