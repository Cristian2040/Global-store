# 🚚 Supplier Fulfillment & Catalog

Suppliers act as the wholesalers in the GlobalStore ecosystem, providing products to physical and digital retail stores.

## 📦 Wholesale Catalog
Suppliers manage their "Supplier Products" which are links to the **Global Catalog**.
-   **Company Linkage**: Most suppliers are associated with a specific **Company** (Brand) and primarily offer that company's products.
-   **Pricing**: Defined as `wholesalePrice` (usually in bulk units).
-   **Minimum Orders**: Suppliers can set minimum quantities for restock requests.

## 🔄 Restock Order Workflow
When a store sends a request, the supplier manages it via the "Pedidos" dashboard:
1.  **ACEPTAR**: Reserves stock and notifies the store.
2.  **RECHAZAR**: Releases any pending reservations (if applicable).
3.  **EN PREPARACIÓN**: Internal state indicating the order is being picked.
4.  **EN RUTA**: Indicates the shipment is on the way.

## 🔑 Secure Delivery
The final step of a Restock Order is the hand-off.
-   The supplier must provide the correct code (given to the store) to finalize the order in the system.
-   This ensures accurate inventory synchronization on both sides.

## 📊 Supplier Dashboard
-   **Incoming Order Stats**: Pending vs. Total Today.
-   **Catalog Performance**: Which products are most requested by stores.
