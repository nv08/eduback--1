const mongoose = require("mongoose");
const { Schema } = mongoose;
const ChatSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
