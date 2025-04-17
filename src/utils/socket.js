const { Server } = require("socket.io");
const Chat = require("../models/chatModel");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("connected socket");

    socket.on("join", (connectionId, loggedInId, firstName) => {
      let roomId = [connectionId, loggedInId].sort().join("_");
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ connectionId, senderId, firstName, text }) => {
        let roomId = [connectionId, senderId].sort().join("_");
        try {
          let chat = await Chat.findOne({
            participants: {
              $all: [connectionId, senderId],
            },
          });

          if (!chat) {
            chat = new Chat({
              participants: [connectionId, senderId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: senderId, text: text });

          await chat.save();
        } catch (error) {
          console.log(error);
        }

        io.to(roomId).emit("receivedMessage", { firstName, text, senderId });
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = initializeSocket;
