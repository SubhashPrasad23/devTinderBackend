const express = require("express");
const userAuth = require("../middlewares/userAuth");
const Chat = require("../models/chatModel");

const chatRouter = express.Router();

chatRouter.get("/chat/:connectionId", userAuth, async (req, res) => {
  
  const loggedInUserId = req.user._id;
  const connectionId = req.params.connectionId;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [loggedInUserId, connectionId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [loggedInUserId, connectionId],
        messages: [],
      });
      await chat.save();
    }

    res.send(chat);
  } catch (error) {
    console.log(error);
  }
});

module.exports = chatRouter;
