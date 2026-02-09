# 🌍 GlobalStore - Multi-Role E-Commerce Platform

**GlobalStore** is a comprehensive e-commerce solution that connects **Customers**, **Stores**, **Suppliers**, and **Companies** in a seamless, role-based ecosystem.

## 📚 Documentación Completa

Hemos centralizado toda la información técnica y funcional en la carpeta [`docs/`](./docs/). Por favor, consulta los siguientes enlaces para una guía detallada:

### 🏗️ [Arquitectura](./docs/architecture/overview.md)
*   [**Visión General**](./docs/architecture/overview.md): Diseño del sistema y patrones core.
*   [**Modelos de Datos**](./docs/architecture/data_models.md): Modelos Mongoose, ERD e indexación.
*   [**Seguridad**](./docs/architecture/security.md): JWT, Auth y control de acceso (RBAC).

### ✨ [Módulos Funcionales](./docs/functional/customer_flow.md)
*   [**Flujo del Cliente**](./docs/functional/customer_flow.md): Carrito inteligente, mapas y GastroBot.
*   [**Operaciones de Tienda**](./docs/functional/store_operations.md): Gestión de inventario y pedidos.
*   [**Surtimiento de Proveedores**](./docs/functional/supplier_fulfillment.md): Catálogo mayorista y entregas.
*   [**Control Administrativo**](./docs/functional/admin_oversight.md): Dashboard de control y analíticas.

### 🛠️ [Referencia Técnica](./docs/technical/backend_stack.md)
*   [**Stack Backend**](./docs/technical/backend_stack.md): Node.js, Express, MongoDB y Joi.
*   [**Stack Frontend**](./docs/technical/frontend_stack.md): Next.js 14, Tailwind y Context API.
*   [**Manifiesto de Endpoints**](./docs/technical/endpoints_manifest.md): Catálogo completo de la API.

### 🚀 [Desarrollo y Ops](./docs/development/setup_guide.md)
*   [**Guía de Instalación**](./docs/development/setup_guide.md): Setup local paso a paso.
*   [**Pruebas (Testing)**](./docs/development/testing.md): Estándares y ejecución de tests.

### 📖 [Manuales de Usuario](./docs/user_guides/customer_manual.md)
*   [Manual del **Cliente**](./docs/user_guides/customer_manual.md)
*   [Manual de la **Tienda**](./docs/user_guides/store_manual.md)
*   [Manual del **Proveedor**](./docs/user_guides/supplier_manual.md)
*   [Manual del **Administrador**](./docs/user_guides/admin_manual.md)

---

## 🛠️ Inicio Rápido

### Requisitos
- Node.js (v18+)
- MongoDB (Instancia local o Atlas)

### Instalación en 3 pasos

1.  **Clonar y Dependencias**
    ```bash
    git clone https://github.com/FelipeEstrellaPro/GlobalStore.git
    cd GlobalStore
    cd backend && npm install && cd ../frontend && npm install
    ```

2.  **Configuración**
    - Crea el archivo `.env` en `backend/` y `.env.local` en `frontend/` usando los ejemplos proporcionados.

3.  **Ejecutar**
    - Backend: `npm run dev` (en carpeta backend)
    - Frontend: `npm run dev` (en carpeta frontend)

---

## 🤝 Contribuidores

- **Felipe Estrella** - Lead Developer
- **Antigravity AI** - AI Co-Pilot

---
*Built with ❤️ for the Global E-Commerce Community.*
