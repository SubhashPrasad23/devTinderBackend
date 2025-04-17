const express = require("express");
const userAuth = require("../middlewares/userAuth");
const profileRouter = express.Router();
const validateEditProfile = require("../utils/validation");
const User = require("../models/userModel");
const upload = require("../middlewares/upload");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    res.json({ message: "User fetch sucessfully", data: req.user });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.post(
  "/profile/edit",
  userAuth,
  upload.single("photoURL"),
  async (req, res) => {
    try {
      if (!validateEditProfile(req)) {
        return res.status(400).json({ error: "Invalid edit request" });
      }

      const loggedInUser = req.user;

      if (req.file) {
        const profileUrl = await uploadToCloudinary(req.file.path);
        loggedInUser.photoURL = profileUrl;
      }

      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });

      await loggedInUser.save();

      res.json({
        message: "Your profile updated successfully",
        data: loggedInUser,
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete({ _id: userId });

    res.send("Deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

profileRouter.patch("/profile/password", userAuth, (req, res) => {
  const currentPassword = req.body.password;
});

module.exports = profileRouter;
