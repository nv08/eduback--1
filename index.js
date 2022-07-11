const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

const connectToMongo = require("./db");

connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
//app.use(express.json());
app.use(bodyParser.json());

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));

app.get("/", (req, res) => {
  res.send("connected to database horry yayy");
});

app.listen(PORT, () => {
  console.log("Example app listening at", +PORT);
});
