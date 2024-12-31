require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://inspiring-jelly-43332e.netlify.app",
    ],
    credentials: true,
    methods: ["POST", "PUT", "GET", "DELETE"],
  })
);

const connectDB = require("./db");
connectDB();

const authRouter = require("./routers/auth");
app.use("/api/auth", authRouter);

const orderRouter = require("./routers/order");
app.use("/api/order", orderRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
