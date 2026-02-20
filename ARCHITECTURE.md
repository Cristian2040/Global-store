# 🏗️ System Architecture

GlobalStore follows a **Micro-Modular Monolith** approach, separating concerns strictly between the Frontend (Presentation Layer) and Backend (Business Logic & Data Layer), communicating via RESTful APIs.

## 🧩 Architectural Pattern

### Frontend (Client-Side)
- **Framework**: Next.js 14 (App Router)
- **Pattern**: Component-Based Architecture
- **State Management**: React Context (`AuthContext`, `CartContext`) + Local State
- **Styling**: Utility-First via Tailwind CSS

### Backend (Server-Side)
- **Framework**: Node.js + Express
- **Pattern**: Layered Architecture (Controller-Service-Model)
    - **Controllers**: Handle HTTP requests, parsing, and response formatting.
    - **Services**: Contain business logic, validation, and data manipulation.
    - **Models**: Define database schema (Mongoose) and data rules.
    - **Routes**: Map API endpoints to controllers.

## 👥 User Roles & Permissions

The system is built around 4 distinct user roles, each with a dedicated dashboard and permission set:

| Role | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Customer** | End-users shopping for products. | Browse Stores, Cart, Checkout, Order History, Profile. |
| **Store** | Retailers selling products. | Manage Inventory, Restock from Suppliers, Fulfill Orders. |
| **Supplier** | Wholesalers supplying stores. | Manage Catalog, Process Restock Orders, Logistics. |
| **Admin/Company** | Platform owners. | User Management, Global Settings, System Oversight. |

## 🔄 Data Flow

1.  **Request**: Client (Frontend) sends an HTTP request (w/ JWT token) to the API.
2.  **Auth Layer**: Middleware verifies the token and extracts user role/ID.
3.  **Routing**: Express router directs the request to the specific Controller.
4.  **Validation**: Joi schemas validate the request body/params.
5.  **Logic**: Controller calls the Service layer for business processing.
6.  **Data Access**: Service queries MongoDB via Mongoose Models.
7.  **Response**: Data is formatted and sent back to the Client.

## 📁 Directory Structure

```
GlobalStore/
├── backend/            # Express Server
│   ├── src/
│   │   ├── controllers/ # Request Handlers
│   │   ├── models/      # Mongoose Schemas
│   │   ├── routes/      # API Definitions
│   │   ├── services/    # Business Logic
│   │   ├── middlewares/ # Auth & Error Handling
│   │   └── utils/       # Helpers (Validators, Logger)
│   └── tests/          # Unit & Integration Tests
│
├── frontend/           # Next.js Application
│   ├── src/
│   │   ├── app/        # Pages (App Router)
│   │   ├── components/ # Reusable UI Components
│   │   ├── contexts/   # Global State Providers
│   │   ├── hooks/      # Custom React Hooks
│   │   └── lib/        # API Client & Utils
│   └── public/         # Static Assets
└── README.md           # Entry Point
```
