# ⚙️ Backend Stack Reference

The GlobalStore backend is a high-performance REST API built with stability, security, and scalability in mind.

## 🛠️ Core Technologies

| Tech | Purpose | Usage in Project |
| :--- | :--- | :--- |
| **Node.js** | Runtime | Primary execution environment. |
| **Express** | Framework | API routing and middleware management. |
| **MongoDB** | Database | NoSQL storage for flexible multi-role data structures. |
| **Mongoose** | ODM | Schema enforcement and relationship management. |
| **Joi** | Validation | Strict request payload validation. |
| **Bcrypt** | Security | One-way hashing for user passwords. |
| **Winston** | Logging | Standardized log formatting for errors and activity. |

## 🏗️ Implementation Details

### 🔹 Layers
1.  **Middlewares**: 
    - `auth.middleware.js`: JWT verification and role checking.
    - `error.middleware.js`: Centralized `AppError` handling.
2.  **Utils**:
    - `responseHandler.js`: Standardizes all JSON outputs into `{ success, data, message }`.
    - `asyncHandler.js`: Eliminates redundant Try/Catch blocks in controllers.

### 🔹 Performance Patterns
-   **Pagination**: Most "list" endpoints (Products, Users) support `page` and `limit` params to prevent memory overflow.
-   **Aggregations**: Complex stats (like platform revenue) are calculated using MongoDB's `$aggregate` pipeline for database-side efficiency.

## 🚀 Environment Configuration
Configuration is managed via `.env` files. Key variables include:
- `MONGO_URI`: Connection string for the database.
- `JWT_SECRET`: signing key for access tokens.
- `PORT`: Server port (default 5000).
