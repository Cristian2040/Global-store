# 🎨 GlobalStore Frontend

The customer-facing and dashboard interface for the GlobalStore ecosystem. Built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**.

## 🌟 Features

- **Multi-Role Dashboards**: Dedicated UI for Customers, Stores, Suppliers, and Admins.
- **Authentication**: JWT-based login with role-based route protection.
- **Interactive Maps**: Google Maps integration for store location.
- **Real-Time Context**: Cart and Auth state management via React Context.
- **Responsive Design**: Mobile-first architecture using Tailwind CSS.

## 📁 Project Structure

```
src/
├── app/                  # App Router Pages
│   ├── (auth)/           # Authentication Routes (Login/Register)
│   ├── customer/         # Customer Dashboard
│   ├── store/            # Store Dashboard
│   ├── supplier/         # Supplier Dashboard
│   └── admin/            # Admin Dashboard
├── components/           # Reusable UI Components
│   ├── common/           # Generic (Inputs, Buttons, Modals)
│   ├── layout/           # Sidebar, Navbar
│   └── ui/               # Design System Primitives
├── contexts/             # Global State (Auth, Cart)
├── hooks/                # Custom Hooks (useDebounce, etc.)
└── lib/                  # Utilities (API Client, Formatters)
```

## 🚀 Development

### Setup

1.  Current directory: `frontend/`
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    - Copy `.env.example` to `.env.local`
    - Ensure `NEXT_PUBLIC_API_URL` points to your backend (default: `http://localhost:5000/api`)

### Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧩 Key Components

- **`DashboardLayout`**: Wraps pages with the appropriate Sidebar and Navbar based on user role.
- **`AuthContext`**: Manages user session and token storage/retrieval.
- **`CartContext`**: Handles shopping cart state, persistence, and total calculations.
- **`ChatBot`**: Floating AI assistant component.

## 🎨 Styling

We use **Tailwind CSS** for all styling.
- **Dark Mode**: The application is designed with a dark theme by default (`bg-gray-900`, `text-white`).
- **Icons**: `lucide-react` library.
- **Components**: Custom-built using Tailwind primitives (no heavy UI libraries like MUI/Bootstrap).
