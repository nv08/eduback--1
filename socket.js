const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id);

// send private message to user
   socket.on("private message", (data) => {
     console.log("private message", data);
     socket.broadcast.emit("private message", data);
   }
   );
  socket.on('send_message', (data)=>{
    io.emit('receive_message', data)

  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("Example app listening at", +PORT);
});
