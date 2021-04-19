const express = require("express");
const app = express();
const mongoose = require("mongoose");

const { MONGODB } = require("./config");
const model = require("./models/user");
const PORT = 8000;

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("connected to mongoDb");
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, (err) => {
  if (err) {
    return console.log(`Error: ${err}`);
  }
  console.log(`server running on port: ${PORT}`);
});
