const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  cname: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  rollno: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },



  Date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("user", UserSchema);

module.exports = User;
