const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const apiLimiter = require("./middlewares/rateLimit");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const { CORS_ORIGIN } = require("./config/environment/env");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const storeRoutes = require("./routes/store.routes");
const supplierRoutes = require("./routes/supplier.routes");
const productRoutes = require("./routes/product.routes");
const storeProductRoutes = require("./routes/storeProduct.routes");
const supplierProductRoutes = require("./routes/supplierProduct.routes");
const customerOrderRoutes = require("./routes/customerOrder.routes");
const restockOrderRoutes = require("./routes/restockOrder.routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(apiLimiter);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/store-products", storeProductRoutes);
app.use("/api/supplier-products", supplierProductRoutes);
app.use("/api/companies", require("./routes/company.routes"));
app.use("/api/customer-orders", customerOrderRoutes);
app.use("/api/restock-orders", restockOrderRoutes);
app.use("/api/admin/dashboard", require("./routes/admin.routes"));

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

