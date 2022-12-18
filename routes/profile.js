const express = require("express");
const router = express.Router();
var fetchuser = require("../Middleware/fetchuser");
const Profiles = require("../models/Profiles");
const { body, validationResult } = require("express-validator");
const Chat = require("../models/Chat");

const RADIUS_DISTANCE = 10000; //distance in meters (m) --> 10km radius

//Route:0 fetch one user profile using; GET login required
router.get("/fetchuserprofile/:id", fetchuser, async (req, res) => {
  try {
    const profiles = await Profiles.find({ user: req.user.id });

    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

//Route:1 fetch all user profile using; GET login required
//search filter using skills, rollno, city

router.post("/fetchallprofiles", fetchuser, async (req, res) => {
  try {
    const {
        city,
        rollno,
        skills
      } = req.body;
    const profiles = await Profiles.find({
      $and: [
        { city: { $regex: city, $options: "i" } },
        { rollno: { $regex: rollno, $options: "i" } },
        { skills: { $regex: skills, $options: "i" } },
      ],
    }).limit(10);



    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

//Route:2 add profiles of user using; Post login required

router.post(
  "/addprofiles",
  fetchuser,
  [
    body("cname", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isLength({ min: 5 }),

    body("phone", "Enter a valid enter a valid phone").isLength({ min: 5 }),
    body("city", "Enter a valid enter a valid phone").isLength({ min: 2 }),
    body("rollno", "Enter a valid enter a valid postal").isLength({ min: 1 }),
    body("address", "Enter a valid enter a valid address").isLength({ min: 5 }),
    body("skills", "Enter a valid enter a valid skills").isLength({ min: 5 }),
    body("description", "Enter a valid enter a valid description").isLength({
      min: 40,
    }),
  ],
  async (req, res) => {
    let success = false;

    try {
      const {
        cname,
        email,
        phone,
        city,
        rollno,
        address,
        skills,
        description,
        location
      } = req.body;

      let geoLocation = undefined;
      if(location){
        const longitude = Number(location[0]);
        const latitude = Number(location[1]);
        geoLocation = { type: 'Point', coordinates: [longitude, latitude] };
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const profiles = new Profiles({
        cname,
        email,
        phone,
        city,
        rollno,
        address,
        skills,
        description,
        location: geoLocation,
        user: req.user.id,
      });
      const savedProfiles = await profiles.save();
      success = true;
      res.json({ success, savedProfiles });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success, "Internel server error");
    }
  }
);

router.post(
  "/getchat",
  fetchuser,
  [],
  async (req, res) => {
    let success = false;

    try {
      const {frUser,toUser} = req.body;

      const chats = await Chat.find({
        $or: [
          {frUser, toUser},
          {toUser: frUser, frUser: toUser}
        ]}
      ).sort({date: 1}).limit(50).lean();

      success = true;
      res.json({ success, chats });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success, "Internel server error");
    }
  }
);

router.post(
  "/getchat",
  fetchuser,
  [],
  async (req, res) => {
    let success = false;

    try {
      const {frUser,toUser} = req.body;

      const chats = await Chat.find({
        $or: [
          {frUser, toUser},
          {toUser: frUser, frUser: toUser}
        ]}
      ).sort({date: 1}).limit(50).lean();

      success = true;
      res.json({ success, chats });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success, "Internel server error");
    }
  }
);

router.post(
  "/getstudentchat",
  fetchuser,
  [],
  async (req, res) => {
    let success = false;

    try {
      const {toUser} = req.body;

      const chats = await Chat.find({toUser}).distinct('frUser').lean();

      success = true;
      res.json({ success, chats });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success, "Internel server error");
    }
  }
);

router.post(
  "/addComment",
  fetchuser,
  async (req, res) => {
    let success = false;
    try {
      const { id, comment, commentBy } = req.body;
      const filter = { _id: id };
      const updateValue = {
        comment: comment,
        commentBy: commentBy,
      };

      const updatedProfile = await Profiles.findOneAndUpdate(filter, { $push: { comments: updateValue }})

      success = true;
      res.json({ success, updatedProfile });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(success, "Internel server error");
    }
  }
);

// get nearby profiles based upon the location coordinates of teacher
router.post("/getNearbyProfiles", fetchuser, async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    const aggregationQuery = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: RADIUS_DISTANCE,
        },
      },
    ];
    const profiles = await Profiles.aggregate(aggregationQuery)
    res.send(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

router.post("/updateLocation", fetchuser, async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    const userId = req.user.id;
    console.log(userId, longitude, latitude);
    const filter = { user: userId };
    const updateValue = { location: { type: 'Point', coordinates: [longitude, latitude]} };
    const profiles = await Profiles.findOneAndUpdate( filter, updateValue );
    console.log(profiles, 'here i come');
    res.send(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});

module.exports = router;
