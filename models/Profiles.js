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
  comments: [
    {
      comment: String,
      commentBy: String, // name of teacher who commented
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number], // structure is [longitude, latitude]
      default: undefined,
    },
  },

  Date: {
    type: Date,
    default: Date.now,
  },
});

ProfileSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Profile", ProfileSchema);
