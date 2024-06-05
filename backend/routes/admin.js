const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("嗨");
});

module.exports = router;
