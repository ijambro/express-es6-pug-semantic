import express from "express";
const router = express.Router();

import node_fetch from "node-fetch";

router.get("/", async function (req, res, next) {
  console.log("Fetching...");
  const fetchResponse = await node_fetch(
    "https://v2.jokeapi.dev/joke/pun?safe-mode"
  );

  const fetchedJson = await fetchResponse.json();
  console.log("Fetched JSON", fetchedJson);

  res.render("jokes", {
    isLoggedIn: req.session.isLoggedIn,
    userName: req.session.userName,
    results: fetchedJson
  });
});

export default router;
