require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const transactionRoutes = require("./routes/transactionRoutes");
const connectDB = require("./config/db");

const app = express();

connectDB();
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
