# 🏁 Customer Flow & Experience

The Customer experience in GlobalStore is designed to be frictionless, visual, and intelligent. It spans discovery, purchase, and tracking.

## 🚀 The Shopping Journey

### 1. Discovery
-   **Interactive Map**: Customers can locate nearby stores using a localized Google Map. Stores are pinned with colorful markers indicating their primary category.
-   **Search & Filters**: A platform-wide search allows finding products by name, brand, or category across all participating stores.

### 2. The "Smart" Shopping Cart
Unlike traditional e-commerce, GlobalStore allows adding items from multiple different stores simultaneously.
-   **Aggregation**: Cart items are grouped by `storeId`.
-   **Checkout Intersection**: The system dynamically calculates common denominators for checkout:
    -   *Payment Methods*: If Store A and Store B both accept "Cash", the checkout only offers "Cash".
    -   *Order Options*: Similarly, "Pickup" vs "Delivery" options are intersected.

### 3. Multi-Store Order Creation
Upon clicking "Create Order", the frontend orchestrates a sequence of API calls:
1.  Constructs individual payloads for each store.
2.  Sends parallel requests to create multiple separate orders in the database.
3.  Clears the local cart only after successful confirmation.

## 🤖 GastroBot (AI Assistant)
GastroBot is a persistent AI companion available on the home page.
-   **Purpose**: Help users find ingredients, suggest recipes, and navigate the platform.
-   **UI**: Floating component with notification pulsing and intelligent simulated responses.

## 📦 Order Lifecycle
Once placed, customers can track their orders in the "Mis Pedidos" section:
-   **Status Timeline**: Track transitions from "CREADA" -> "PAGADA" -> "EN CAMINO" -> "ENTREGADA".
-   **Detail View**: Access itemized receipts and store contact information for every order.
