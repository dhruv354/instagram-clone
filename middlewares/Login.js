const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const { JWT_SECRET } = require("../config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //   console.log(authorization);
  if (!authorization) {
    res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      res.send(401).json({ error: "your token is different " });
    }
    const { _id } = payload;

    //asynchrous request which my take a while so next shouldbe called in this query methodonly

    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
