const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello world");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "please enter all the fields" });
  }
  console.log(req.body.name);
});
module.exports = router;
