const express = require("express");
const router = express.Router();
var fetchuser = require("../Middleware/fetchuser");
const Message = require("../models/Message");

//create user chat

router.post("/sendmessage", async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const newMessage = new Message({
    chatId,
    senderId,
    text,
  });

  try {
    const result = await newMessage.save();
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

// fetch specific chat of users

router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await Message.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

module.exports = router;
