import express from "express";
const router = express.Router();

import node_fetch from "node-fetch";

router.get("/", async function (req, res, next) {
  res.render("index", {
    title: "Jake's Express-ES6-Pug-Semantic project template",
    isLoggedIn: req.session.isLoggedIn,
    userName: req.session.userName
  });
});

export default router;
