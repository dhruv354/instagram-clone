const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Login = require("../middlewares/Login");
const Post = require("../models/post");
const User = require("../models/user");

/***************to see the profile of other users**************/

router.get("/user/:id", Login, (req, res) => {
  console.log("inside user/id route");
  User.findOne({ _id: req.params.id })
    //we dont want to send password to the frontend
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
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

/**********************to follow other users********************/
router.put("/follow", Login, (req, res) => {
  const { followId } = req.body;
  User.findByIdAndUpdate(
    { _id: req.body.followId },
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .then((result) => res.json(result))
        .catch((err) => {
          console.log("error in catch block of follow user");
          console.log(err);
          res.status(422).json(err);
        });
    }
  );
});

/******************to unfollow other users******************** */

router.put("/unfollow", Login, (req, res) => {
  const followId = req.body;
  User.findByIdAndUpdate(
    followId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findOneAndUpdate(
        req.user._id,
        {
          $pull: { following: followId },
        },
        { new: true }
      )
        .then((result) => res.json(result))
        .catch((err) => {
          console.log(err);
          res.status(422).json(err);
        });
    }
  );
});

module.exports = router;
