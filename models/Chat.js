const mongoose = require("mongoose");
const { Schema } = mongoose;
const ChatSchema = new Schema(
  {
    members: {
      type: Array,
    },
    senderDetails: {
      id: String,
      name: String,
    },
    receiverDetails: {
      id: String,
      name: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
