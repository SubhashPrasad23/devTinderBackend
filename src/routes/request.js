const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/conectionRequest");
const User = require("../models/userModel");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    try {
      isAllowedStatus = ["ignored", "interested"];

      if (!isAllowedStatus.includes(status)) {
        throw new Error("Status is not valid");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { toUserId, fromUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnection) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();

      res.json({
        message: "Request send successfully",
        data: connectionRequest,
      });
    } catch (error) {
      res.json(error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("status is not valid");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser._id,
      });
      if (!connectionRequest) {
        return res.status(404).json({ message: "connection not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({
        message: "Connection request" + status,
        data,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
);

module.exports = requestRouter;
