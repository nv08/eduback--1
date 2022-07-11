const mongoose = require("mongoose");
const { Schema } = mongoose;
const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  cname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  skills: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
