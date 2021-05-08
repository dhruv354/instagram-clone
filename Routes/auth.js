const express = require("express");
const router = express.Router();
//decrypting passwords related records
const bcrypt = require("bcryptjs");

//token generation related imports
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
//middlewares imports
const Login = require("../middlewares/Login");

//mongoose model imports
const User = require("../models/user");
const Post = require("../models/post");

router.get("/", (req, res) => {
  // console.log(req.headers);

  res.send("hello world");
});

//protected route for testing purpose
router.get("/protected", Login, (req, res) => {
  console.log(req.headers);
  res.send("protected page");
});

/*****************signup route****************** */
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

/****************************signin route********************** */

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
          // console.log(JWT_SECRET);
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email } = savedUser;
          return res.json({ token, user: { _id, name, email } });
        } else {
          res.send("email or password invalid");
        }
      })
      .catch((err) => console.log(err));
  });
});
