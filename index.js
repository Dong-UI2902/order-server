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
  },
});

socketIo.on("connection", (socket) => {
  ///Handle khi có connect từ client tới
  console.log("New client connected" + socket.id);

  socket.on("sendDataClient", function (data) {
    // Handle khi có sự kiện tên là sendDataClient từ phía client
    socketIo.emit("sendDataServer", { data }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

const connectDB = require("./db");
connectDB();

app.get("/", (req, res) => {
  res.json("welcome to our server");
});

const authRouter = require("./routers/auth");
app.use("/api/auth", authRouter);

const orderRouter = require("./routers/order");
app.use("/api/order", orderRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is started on port ${PORT}`));
