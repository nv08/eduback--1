const express = require("express");
const router = express.Router();
var fetchuser = require("../Middleware/fetchuser");
const Profiles = require("../models/Profiles");
const { body, validationResult } = require("express-validator");

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
      min: 100,
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
      } = req.body;
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

module.exports = router;
