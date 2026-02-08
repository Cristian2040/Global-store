# 📡 API Endpoints

The backend exposes a RESTful API mounted under `/api`. All protected routes require a valid **Bearer Token** in the Authorization header.

## 🔐 Authentication (`/api/auth`)
- `POST /register`: Register a new user (Customer, Store, or Supplier).
- `POST /login`: Authenticate and receive a JWT token.
- `POST /refresh`: Refresh an expired access token.
- `POST /change-password`: Update the current user's password.
- `GET /me`: Get current authenticated user details.

## 👤 Users (`/api/users`)
- `GET /profile`: Get detailed profile (including address/phone).
- `PUT /:id`: Update user profile information.
- `DELETE /:id`: Soft delete a user account.

## 🛒 Customer Operations
### Orders (`/api/customer-orders`)
- `POST /`: Create a new order (supports single or multi-store).
- `GET /my/orders`: List all past orders for the logged-in customer.
- `GET /:id`: Get details of a specific order.
- `PATCH /:id/status`: Update order status (Store use).
- `POST /:id/cancel`: Cancel an order (if eligible).

### Stores (`/api/stores`)
- `GET /`: List all available stores.
- `GET /:id`: Get public details of a store.
- `GET /:id/products`: (Via StoreProducts) List products available in a store.

## 🏪 Store Operations
### Inventory (`/api/store-products`)
- `GET /store/:storeId`: List all products in the store's inventory.
- `POST /`: Add a product to the store inventory.
- `PATCH /:id/stock`: Update stock levels.
- `PUT /:id`: Update product price or details.

### Restocking (`/api/restock-orders`)
- `GET /store/:storeId`: List outgoing restock requests.
- `POST /`: Create a new restock order to a supplier.
- `POST /:id/confirm-delivery`: Confirm receipt of goods (updates inventory).

## 🚚 Supplier Operations
### Catalog (`/api/supplier-products`)
- `GET /supplier/:supplierId`: List products offered by the supplier.
- `POST /`: Add a new product to the catalog.
- `PUT /:id`: Update product pricing/availability.

### Fulfillment (`/api/restock-orders`)
- `GET /supplier/:supplierId`: List incoming restock orders.
- `POST /:id/accept`: Accept an order (reserves stock).
- `POST /:id/reject`: Reject an order (releases stock).

## 📦 Products (Global Catalog) (`/api/products`)
- `GET /`: List global product definitions.
- `GET /categories`: List available product categories.
- `POST /`: Create a new global product (Admin/Company only).
