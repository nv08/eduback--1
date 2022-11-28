const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "edum@";
var fetchuser = require("../Middleware/fetchuser");






//Route:1 create a user using; POST

router.post(
  "/newuser",
  [
    body("cname", "Enter a valid name").isLength({ min: 3 }),
    body("Email", "Enter a valid email").isLength({ min: 5 }),
    body("rollno", "Enter a valid phone").isLength({ min: 2 }),

    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],

  //sending errors using express validation

  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    //check whether the user exist or not
    // succes is also on front end in the form of json.success
    let user = await User.findOne({ Email: req.body.Email });
    if (user) {
      return res
        .status(400)
        .json({ success, error: "Sorry a user with this email already exists" });
    } 
     
      if (!req.body.Email.includes("@")) {
      console.log({ success, error: "Please enter a valid email" });
    }

    // generating hash and salt using npm bcrypt js

    const salt = await bcrypt.genSalt(10);
    const secPas = await bcrypt.hash(req.body.password, salt);

    //creating a new user

    user = await User.create({
      cname: req.body.cname,
      password: secPas,
      Email: req.body.Email,
      rollno: req.body.rollno,
      
    });
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);

    // sending response in json
    success = true;
    res.json({ success, authtoken });

    //console.log(jwtdata)
    //res.json({"Welcome":"We are here to save your data securily"})
    //.then(user => res.json(user))
    //.catch(err=>{console.log(err)
    //  res.json({error: 'Please enter a valid value'})})
  }
);
//Route:2 create a user using; POST login

router.post(
  "/login",
  [
    body("Email", "Enter a valid Email").isLength({ min: 10 }),
    body("password", "Enter a valid password").exists(),
  ],

  //send errors using express validator

  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //find the user exist or not
    const { Email, password } = req.body;
    let user = await User.findOne({ Email });
    try {
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please enter correct credentials" });
      }

      //compare the password of the user

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Please enter correct credentials" });
      }

      //if information true then return

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // sending response in json

      res.json({ success, authtoken, data });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internel server error");
    }
  }
);

//Route:3 Get the information of the user
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internel server error");
  }
});






module.exports = router;
