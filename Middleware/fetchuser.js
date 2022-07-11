var jwt = require("jsonwebtoken");
const JWT_SECRET = "edum@";

const fetchuser = (req, res, next) => {
  // get the user fron jwt token and add to req object

  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });

    
    //res.json(401).send({ error: "Please enter the correct entities" });
    
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;

    next();
  } catch (error) {
   console.log(error);
  }
};

module.exports = fetchuser;
