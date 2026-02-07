const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

async function connectDB() {
  if (!MONGO_URI) throw new Error("MONGO_URI no configurado");
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB conectado");
}

module.exports = connectDB;
