const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Login = require("../middlewares/Login");
const Post = require("../models/post");

//************creating a post**************
router.post("/createpost", Login, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  console.log(req.user);
  //   return res.status(200).json({ success: req.body });
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => res.json({ post: result }))
    .catch((err) => console.log(err));
});

/* *****for getting all posts ***** */
router.get("/allposts", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

router.get("/myposts", Login, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myPost) => res.json({ myPost }))
    .catch((err) => console.log(err));
});

module.exports = router;
