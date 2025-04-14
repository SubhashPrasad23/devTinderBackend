const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token not found, please log in" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = userAuth;
