# 🌍 GlobalStore - Multi-Role E-Commerce Platform

**GlobalStore** is a comprehensive e-commerce solution designed to connect **Customers**, **Stores**, **Suppliers**, and **Companies** in a seamless ecosystem. Built with a modern tech stack, it facilitates the entire supply chain from supplier restocking to customer delivery.

## 🚀 Key Features

### 👤 Customer Experience
- **Interactive Dashboard**: Real-time stats, order tracking, and favorite stores.
- **Smart Shopping**: Multi-store cart, dynamic checkout, and intelligent product search.
- **GastroBot 🤖**: AI-powered assistant for recipe suggestions and site navigation.
- **Geo-Location**: Interactive map to find nearby stores.

### 🏪 Store Operations
- **Inventory Management**: Real-time stock tracking and low-stock alerts.
- **Supplier Integration**: Browse supplier catalogs and restock inventory directly.
- **Order Fulfillment**: Manage customer orders and track delivery status.
- **Analytics**: Sales performance and inventory health reports.

### 🚚 Supplier Management
- **Catalog Control**: Manage products, pricing, and availability.
- **Restock Requests**: Process bulk orders from stores.
- **Delivery Tracking**: Manage logistics and delivery confirmations.

### 🏢 Company/Admin Control
- **System Oversight**: User management and platform configuration.
- **Global Catalog**: Standardize products across the ecosystem.
- **Audit Logs**: Track all system activities.

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (Running instance)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/FelipeEstrellaPro/GlobalStore.git
    cd GlobalStore
    ```

2.  **Install Dependencies**
    ```bash
    # Install Backend Dependencies
    cd backend
    npm install

    # Install Frontend Dependencies
    cd ../frontend
    npm install
    ```

3.  **Configuration**
    - Create a `.env` file in `backend/` (see `backend/.env.example`).
    - Create a `.env.local` file in `frontend/` (see `frontend/.env.example`).

4.  **Run the Application**
    ```bash
    # Terminal 1: Start Backend
    cd backend
    npm run dev

    # Terminal 2: Start Frontend
    cd frontend
    npm run dev
    ```

5.  **Access the App**
    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:5000`

## 📚 Documentation

Explore the detailed documentation for each aspect of the system:

- [**Architecture**](./ARCHITECTURE.md): System design, roles, and data flow.
- [**API Endpoints**](./ENDPOINTS.md): Comprehensive list of backend API routes.
- [**Technologies**](./TECHNOLOGIES.md): Full tech stack and libraries used.
- [**Diagrams**](./DIAGRAMS.md): Visual representations of flows and schemas.

## 🤝 Contributors

- **Felipe Estrella** - Lead Developer
- **Antigravity AI** - AI Co-Pilot

---
*Built with ❤️ for the Global E-Commerce Community.*
