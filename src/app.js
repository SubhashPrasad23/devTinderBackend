const express = require("express");
const connectDB = require("./config/db");
const app = express();
const http = require("http");
const User = require("./models/userModel");
const authRouter = require("./routes/Auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
require("dotenv").config();

var cors = require("cors");
const cookieParser = require("cookie-parser");
const initializeSocket = require("./utils/socket");

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

console.log(process.env.PORT);
connectDB()
  .then(() => {
    server.listen(PORT, () => console.log("app is running on", PORT));
  })
  .catch((err) => {
    console.error("database not connected");
  });
const PORT = process.env.PORT || 5000;
