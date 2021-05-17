const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Login = require("../middlewares/Login");
const Post = require("../models/post");
const User = require("../models/user");

router.get("/user/:id", Login, (req, res) => {
  User.findOne({ _id: req.params.id })
    //we dont want to send password to the frontend
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params._id })
        .populate("postedBy", "name _id")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json(err);
          } else {
            res.json({ user, posts });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: "User not found" });
    });
});

module.exports = router;
