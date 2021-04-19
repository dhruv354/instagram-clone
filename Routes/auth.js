const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

router.get("/", (req, res) => {
  res.send("hello world");
});

//signup route
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "please enter all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists in the database" });
      }
      //if user does not exist initially
      bcrypt
        .hash(password, 11)
        .then((hashedPassword) => {
          req.body.password = hashedPassword;
          const user = new User(req.body);
          user
            .save()
            .then((user) => res.json({ message: "successfully saved" }))
            .catch((err) => res.send("Error", err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
module.exports = router;

//signIn route

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "please enter both email and password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid username or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((isMatch) => {
        if (isMatch) {
          // res.send("login successful");
          //cookie behaviour
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          return res.json({ token });
        } else {
          res.send("email or password invalid");
        }
      })
      .catch((err) => console.log(err));
  });
});
