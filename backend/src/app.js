const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const apiLimiter = require("./middlewares/rateLimit");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const { CORS_ORIGIN } = require("./config/env");

const app = express();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(apiLimiter);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
