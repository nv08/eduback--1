const express = require("express");
const router = express.Router();
var fetchuser = require("../Middleware/fetchuser");
const Chat = require("../models/Chat");

//create user chat

router.post("/createchat", async (req, res) => {
  const { senderId, receiverId } = req.body;
  const newChat = new Chat({
    members: [senderId, receiverId],
  });

  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

// fetch specific chat of users

router.get("/:userId", async (req, res) => {
  try {
    const chats = await Chat.distinct({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

// find chat of  users

router.get("/find/:firstId/:secondId", async (req, res) => {
  try {
    const chats = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

module.exports = router;
