const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const socket = require('./socket');
const connectToMongo = require("./db");
const http = require('http');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

connectToMongo();
app.use(cors());
//app.use(express.json());
app.use(bodyParser.json());

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

socket.initialize(server);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/message", require("./routes/message"));

app.get("/", (req, res) => {
  res.send("connected to database horry yayy");
});

server.listen(PORT, () => {
  console.log("Example app listening at", +PORT);
});
