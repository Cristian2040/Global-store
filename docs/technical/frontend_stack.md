# 🎨 Frontend Stack Reference

The GlobalStore frontend is a modern, responsive Web Application built for speed and visual excellence.

## 🛠️ Core Technologies

| Tech | Purpose | Usage in Project |
| :--- | :--- | :--- |
| **Next.js 14** | Framework | App Router, SSR/CSR, and routing. |
| **TypeScript** | Language | Type safety for state and API payloads. |
| **Tailwind CSS** | Styling | Utility-first design system with Glassmorphism effects. |
| **Lucide React** | Icons | Crisp, modern icon set. |
| **Context API** | State | Lightweight state management for Auth and Cart. |
| **Sonner** | Notifications| Premium toast notification system. |
| **Date-fns** | Utilities | Relative time formatting for activity logs. |

## 🏗️ Implementation Details

### 🔹 Dashboard Routing
We use a role-based directory structure for pages:
- `/app/customer/`
- `/app/store/`
- `/app/supplier/`
- `/app/admin//`

### 🔹 Design System
Our design favors a "Dark Premium" aesthetic:
- **Colors**: Deep grays (`bg-gray-900`) with vibrant accents (Cyan for Admin, Green for Stores, Purple for Customers).
- **Glassmorphism**: Subtle usage of `bg-opacity` and `backdrop-blur` for modals and cards.
- **Micro-Animations**: CSS transitions and Lucide icons animations for interactive states.

### 🔹 API Integration
-   **Axios Client**: Centralized in `lib/api.ts` with base URL and interceptors for adding the JWT token automatically.
-   **Error Handling**: Global toast triggers for failed requests.

## 🌐 Dynamic Logic
The frontend contains significant client-side logic for:
-   **Cart Math**: Floating-point cent calculations to avoid precision issues.
-   **Map Filters**: CSS-based filter inversion for Google Maps dark theme.
-   **Form Steps**: State-based multi-page registration flow.
