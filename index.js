const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const { MONGODB } = require("./config");
const model = require("./models/user");
const router = require("./Routes/auth");
const PORT = 8000;

/***********************************config ************************* */
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("connected to mongoDb");
});

/********************model imports ***************************/

const User = require("./models/user");
const Post = require("./models/post");

/********************************middlewares**************************** */
app.use(express.json());
app.use(cors());
app.use(router);
app.use(require("./Routes/posts"));

/**********************listening on server *********************** */
app.listen(PORT, (err) => {
  if (err) {
    return console.log(`Error: ${err}`);
  }
  console.log(`server running on port: ${PORT}`);
});
