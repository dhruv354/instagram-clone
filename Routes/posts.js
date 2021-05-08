const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Login = require("../middlewares/Login");
const Post = require("../models/post");

//************creating a post**************
router.post("/createpost", Login, (req, res) => {
  const { title, body, image } = req.body;
  console.log(title, body, image);
  if (!title || !body) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  console.log(req.user);
  //   return res.status(200).json({ success: req.body });
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: image,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => res.json({ post: result }))
    .catch((err) => console.log(err));
});

/**************for getting all posts ***************/
router.get("/allposts", Login, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => res.json(posts))
    .catch((err) => console.log(err));
});

/*************for getting my posts************ */
router.get("/myposts", Login, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myPost) => res.json({ myPost }))
    .catch((err) => console.log(err));
});

/********************liking a post****************** */
router.put("/like", Login, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      return res.json(result);
    }
  });
});

/*******************unliking a post********************** */
router.put("/unlike", Login, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      return res.json(result);
    }
  });
});

/*********************commenting on a post*********************** */
router.put("/comment", Login, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.json(result);
      }
    });
});

/****************deleting a post ************* */
router.delete("/delete/:postId", Login, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (!err || !post) {
        res.status(422).json({ err: err });
      }
      if (post.postedBy._id.toString() == req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json({ message: "Successfully removed the post" });
          })
          .catch((err) => console.log(err));
      }
    });
});

module.exports = router;
