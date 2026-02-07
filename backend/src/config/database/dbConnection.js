const mongoose = require('mongoose');
const { MONGODB_URI } = require('../environment/env');

async function connectDB() {
  if (!MONGO_URI) throw new Error("MONGO_URI no configurado");
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB conectado");
}

module.exports = connectDB;
