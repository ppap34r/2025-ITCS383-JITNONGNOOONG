# 2025-ITCS383-MharRuengSang

# Project Overview: Food Delivery System

The goal is to build a scalable food delivery platform (similar to Grab or Line Man) that connects customers, restaurants, and riders, managed by a central administration team.

---

## 1. User Roles (Actors)

- **Customer:** Browses, orders food, pays, and rates the service.
- **Restaurant:** Manages menus, prices, and prepares orders.
- **Rider (Delivery Man):** Accepts deliveries and transports food to customers.
- **System Administrator:** Monitors revenue, manages user accounts, and creates system-wide promotions.

---

## 2. Functional Requirements

### **A. Customer Journey**

- **Registration & Profile:** Must provide First Name, Last Name, Address, and Payment Info (Credit Card).
- **Security:** Multi-factor authentication (OTP via mobile) is required for login. Passwords must be updated every month.
- **Discovery:** View a list of restaurants with filters for:
    - Cuisine type (Thai, Japanese, Western, etc.)
    - Distance from the customer's location.
- **Ordering:** Select food items and checkout.
- **Payment:** Support for Credit Cards and Bank Transfer (QR Code/PromptPay).
- **Rating:** Ability to rate riders based on politeness and speed after delivery.

### **B. Restaurant Management**

- **Order Handling:** Receive and view incoming orders to begin preparation.
- **Menu Management:** Add, delete, or update menu items and adjust prices.
- **Marketing:** Create restaurant-specific promotions or special packages to boost sales.

### **C. Rider Operations**

- **Order Picking:** View and accept orders near their current location.
- **Navigation:** Access customer address for delivery.
- **Completion:** Confirm delivery to the customer.

### **D. Administration & Business Logic**

- **Revenue Tracking:** Monitor daily/monthly revenue (Company takes a 10% commission on top of food prices).
- **Account Governance:** Ability to enable/disable/delete restaurant or customer accounts (e.g., to prevent scams).
- **System Promotions:** Generate discount codes for specific members or timeframes to increase app usage.

---

## 3. Technical & Non-Functional Requirements

- **Platform Availability:**
    - **Web:** Accessible via all computers and operating systems.
    - **Mobile:** Native or cross-platform apps for both **iOS and Android**.
- **Tech Stack:** Must be developed using **Java technology** only (due to legacy system compatibility).
- **Scalability:** The system must support **10 million concurrent users**.
- **Integrations:**
    - Third-party OTP service for login.
    - Payment Gateways (Credit Card processing and Mobile Banking).

# Team Member
1. 6688005 - Thanaporn Aritidtayamontol
2. 6688064 - Natkrittar Maswongwiwat
3. 6688091 - Pundharee Puckdinukul
4. 6688110 - Kornkanok Soongswang
5. 6688175 - Panatthaphong Yoodee
6. 6688249 - Sahatsawat Nitjaphant
