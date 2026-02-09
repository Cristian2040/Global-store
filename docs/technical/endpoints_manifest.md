# 📡 Endpoints Manifest

This manifest is a comprehensive reference for all available API endpoints in the GlobalStore ecosystem.

## 🔐 Auth & Identity

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Multi-role user registration. |
| `POST` | `/auth/login` | Returns Access + Refresh tokens. |
| `POST` | `/auth/change-password` | Updates authenticated user password. |
| `GET` | `/users/profile` | Detailed user data + Address. |

## 📦 Products & Catalog

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/products` | List Global Catalog. |
| `GET` | `/products/categories` | List unique categories. |
| `POST` | `/admin/dashboard/stats` | Aggregated platform metrics. |

## 🛒 Sales & Orders

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/customer-orders` | Create order (single/multi store). |
| `GET` | `/customer-orders/my/orders`| Customer's order history. |
| `PATCH` | `/customer-orders/:id/status`| Update order state. |

## 🏗️ Example Payloads

### Create Order (`POST /api/customer-orders`)
```json
{
  "storeId": "65b...",
  "items": [
    { "storeProductId": "65c...", "quantity": 2 }
  ],
  "payment": { "method": "CASH" },
  "fulfillment": { "type": "PICKUP" }
}
```

### Update Inventory (`PATCH /api/store-products/:id/stock`)
```json
{
  "stock": 150
}
```

## ⚠️ Response Codes
- `200 OK`: Successful GET/PUT/PATCH.
- `201 Created`: Successful POST.
- `400 Bad Request`: Validation failure (check message).
- `401 Unauthorized`: Token missing or expired.
- `403 Forbidden`: Insufficient role permissions.
- `500 Server Error`: Unexpected internal failure.
