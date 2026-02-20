const app = require("./app");
const connectDB = require("./config/database/dbConnection");
const { PORT } = require("./config/environment/env");

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 API en http://localhost:${PORT}`));
})();
