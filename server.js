const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Server } = require("socket.io");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, {});
io.on("connection", (socket) => {
  console.log("NEW WS  connection");
  socket.emit("hello", { name: "Prajwal", city: "Mysore", ordered_Food: true });
});

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
}
app.use(express.static(path.join(__dirname, "build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

httpServer.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port " + port);
});
