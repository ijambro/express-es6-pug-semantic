import express from "express";
const router = express.Router();

import { getUsers } from "../db/mock_controller.js";

router.get("/", async function (req, res, next) {
  res.render("users", {
    users: await getUsers(),
    isLoggedIn: req.session.isLoggedIn,
    userName: req.session.userName
  });
});

export default router;
