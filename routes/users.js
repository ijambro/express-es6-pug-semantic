import express from "express";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("users", {
    users: ["Jake", "Demo 1", "Demo 2"],
    isLoggedIn: req.session.isLoggedIn,
    userName: req.session.userName
  });
});

export default router;
