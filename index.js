require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const http = require("http");
const server = http.createServer(app);

const cors = require("cors");
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["POST", "PUT", "GET", "DELETE"],
  })
);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketIo.on("connection", (socket) => {
  ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id);

  socket.on("sendDataToServer", function (data) {
    socket.emit("sendDataToClient", { ...data });
  });

  socket.on("sendDataUpdateToServer", function (data) {
    socket.emit("sendDataUpdateToClient", { ...data });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const connectDB = require("./db");
connectDB();

const authRouter = require("./routers/auth");
app.use("/api/auth", authRouter);

const orderRouter = require("./routers/order");
app.use("/api/order", orderRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
