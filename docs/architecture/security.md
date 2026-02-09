# 🛡️ Security & Access Control

GlobalStore implements a robust security layer centered around **JSON Web Tokens (JWT)** and **Role-Based Access Control (RBAC)** to protect sensitive business data.

## 🔑 Authentication Flow

We use a dual-token system for maximum security:

1.  **Access Token**: Short-lived (e.g., 15-60 mins) JWT stored in application memory.
2.  **Refresh Token**: Long-lived (e.g., 7 days) token stored in a secure, HTTP-only cookie.

### Step-by-Step Logic:
1.  **Login**: User provides email/password.
2.  **Generation**: Backend verifies credentials and issues both tokens.
3.  **Authorization**: Front-end includes the Access Token in the `Authorization: Bearer <token>` header for all API calls.
4.  **Renewal**: When an Access Token expires, the client calls `/api/auth/refresh` with the Refresh Token to get a new Access Token.

## 👥 Role-Based Access Control (RBAC)

Permissions are enforced via two primary middlewares:
-   `authenticate`: Verifies the JWT and attaches the `user` object to the request.
-   `authorize(...roles)`: Checks if the user's role matches the required permission for the route.

### Permission Mapping

| Module | Customer | Store | Supplier | Admin/Company |
| :--- | :---: | :---: | :---: | :---: |
| **Profiles** | Own Only | Own Only | Own Only | All |
| **Orders** | Own Only | Own Store | Own Supplier | All |
| **Inventory** | View | Own Store | Own Catalog | All |
| **System Settings**| No Access | No Access | No Access | Manage |

## 🛡️ Data Protection

### 🔹 Password Hashing
We use **Bcrypt** with a salt factor of 10. Passwords are never stored in plain text and are excluded from API responses by default (`select: false` in Mongoose).

### 🔹 Input Validation
Every API endpoint is protected by a **Joi** schema. This prevents NoSQL injection and ensures that only valid data types enter the business logic layer.

### 🔹 Delivery Codes
Restock orders use a secure confirmation mechanism:
1.  A random code is generated for the Store.
2.  The Supplier must provide this code at the time of delivery.
3.  The backend verifies the provided code (which may be hashed) before updating inventory, ensuring a physical hand-off occurred.

## 🌐 Multi-Tenancy (Future Proofing)
The architecture includes `tenantId` fields in most models. This allows the system to isolate data for different business groups while running on shared infrastructure, ensuring that high-level queries are always scoped to the appropriate "Tenant".
