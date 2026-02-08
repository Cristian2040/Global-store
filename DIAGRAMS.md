# 📊 System Diagrams

Visual representations of the core workflows and data structures in GlobalStore.

## 🔐 Registration & Auth Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB

    User->>Frontend: Fills Registration Form
    Frontend->>Backend: POST /api/auth/register
    Backend->>Backend: Validate Data (Joi)
    Backend->>Backend: Hash Password (Bcrypt)
    Backend->>DB: Save User (Role: Customer/Store/Supplier)
    DB-->>Backend: Success
    Backend-->>Frontend: 201 Created
    
    User->>Frontend: Login
    Frontend->>Backend: POST /api/auth/login
    Backend->>DB: Find User
    DB-->>Backend: User Data
    Backend->>Backend: Verify Password
    Backend->>Backend: Generate JWT
    Backend-->>Frontend: Return Token + User Info
```

## 🛒 Customer Ordering Flow

```mermaid
sequenceDiagram
    participant Customer
    participant Cart
    participant Backend
    participant Store

    Customer->>Cart: Add Product (Store A)
    Customer->>Cart: Add Product (Store B)
    Customer->>Cart: Proceed to Checkout
    Cart->>Backend: GET /api/cart/validate
    Backend-->>Cart: Valid Options (Common Payment/Delivery)
    Customer->>Cart: Confirm Order
    Cart->>Backend: POST /api/customer-orders (Batch)
    par Process Store A
        Backend->>Store: Create Order A
        Backend->>Store: Deduct Stock A
    and Process Store B
        Backend->>Store: Create Order B
        Backend->>Store: Deduct Stock B
    end
    Backend-->>Customer: Order Confirmation
```

## 🚛 Restock Flow (B2B)

```mermaid
graph LR
    Store[Store Inventory] -- Low Stock --> RestockRequest[Create Restock Order]
    RestockRequest --> Supplier[Supplier Dashboard]
    Supplier -- 1. Accept --> Prep[Preparation]
    Prep -- 2. Ready --> Ship[Shipping]
    Ship -- 3. Deliver --> StoreRec[Store Receiving]
    StoreRec -- 4. Confirm --> StockUp[Update Inventory]
    
    Supplier -- Reject --> Cancel[Order Cancelled]
    Cancel --> Refund[Refund Supplier Stock]
```

## 🗄️ Database Schema (Simplified)

```mermaid
erDiagram
    USER ||--o{ STORE : owns
    USER ||--o{ SUPPLIER : owns
    USER ||--o{ CUSTOMER_ORDER : places
    
    STORE ||--o{ STORE_PRODUCT : has
    STORE ||--o{ CUSTOMER_ORDER : receives
    STORE ||--o{ RESTOCK_ORDER : requests
    
    SUPPLIER ||--o{ SUPPLIER_PRODUCT : offers
    SUPPLIER ||--o{ RESTOCK_ORDER : fulfills
    
    PRODUCT ||--o{ STORE_PRODUCT : "instance of"
    PRODUCT ||--o{ SUPPLIER_PRODUCT : "instance of"
    
    CUSTOMER_ORDER ||--|{ ORDER_ITEM : contains
    RESTOCK_ORDER ||--|{ ORDER_ITEM : contains
```
