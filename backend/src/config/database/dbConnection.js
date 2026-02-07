const mongoose = require('mongoose');
const { MONGODB_URI } = require('../environment/env');

async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI no configurado");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB conectado");
}

module.exports = connectDB;
