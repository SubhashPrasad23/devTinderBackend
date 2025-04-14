const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/conectionRequest");
const User = require("../models/userModel");


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoURL");

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.statusCode(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName bio age")
      .populate("toUserId", "firstName lastName bio age photoURL");

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "Data fetch successfully ", data: data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;
      const connectionRequests=await ConnectionRequest.find({
        $or:[{toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}]
      }).select("fromUserId toUserId")

      

      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });

      const users=await User.find({
        $and:[{_id:{$nin:Array.from(hideUsersFromFeed)}},{_id:{$ne:loggedInUser._id}}]
      }).select("firstName lastName age skills bio yearOfExperience photoURL").skip(skip).limit(limit)
  
      res.json({users });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });


module.exports = userRouter;
