import express from "express";
const router = express.Router();

import * as db from "../db/mock_controller.js";

const DB_ERROR = "Failure connecting to the database.";
const NO_LOGIN = "Please login to access this page.";
const INCORRECT_LOGIN = "Incorrect email or password.  Please try again.";
const CREATE_FAILED = "Registration failed.  Please try again.";
const PASSWORDS_MUST_MATCH =
  "You must enter matching passwords.  Please try again.";

// "Middleware" to verify the user has logged in
export function verifyLoggedIn(req, res, next) {
  console.log("verifyLoggedIn: " + req.url);

  // If logged in, render the requested page
  if (req.session && req.session.isLoggedIn === true) {
    console.log("User is logged in, with user_id = " + req.session.userId);
    next();
  }
  // Else, redirect to the login page
  else {
    console.log("User is not logged in.  Redirecting to login page.");
    res.status(401).render("login", {
      error_message: NO_LOGIN
    });
    return;
  }
}

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/login", async function (req, res, next) {
  try {
    // Response from DB query is an array of row objects.  Has one row if successful.
    const user = await db.validateLogin(
      req.body["email"],
      req.body["password"]
    );
    console.log("Response from DB validateLogin: ", user);

    if (
      user &&
      user.length === 1 &&
      user[0] &&
      user[0].email === req.body["email"]
    ) {
      console.log("Authenticated " + req.body["email"]);
      req.session.isLoggedIn = true;
      req.session.userId = user[0].id;
      req.session.user = user[0];
      req.session.userName = `${user[0].first_name} ${user[0].last_name}`;

      // Record the login in user_activity
      await db.recordLoginActivity(user[0].id);

      res.redirect("/");
    } else {
      console.log(INCORRECT_LOGIN);
      res.render("login", {
        error_message: INCORRECT_LOGIN,
        email: req.body["email"]
      });
    }
  } catch (error) {
    console.error("Query failed!", error);
    res.render("login", { error_message: DB_ERROR });
  }
});

router.post("/register", async function (req, res, next) {
  if (req.body["password"] !== req.body["confirm_password"]) {
    return res.render("login", {
      error_message: PASSWORDS_MUST_MATCH,
      email: req.body["email"]
    });
  }

  try {
    // Store all the fields for the new user
    let user = await db.createUser(
      req.body["first_name"],
      req.body["last_name"],
      req.body["email"],
      req.body["password"]
    );
    console.log("Response from DB createUser: ");
    console.log(user);

    if (
      user &&
      user.length === 1 &&
      user[0] &&
      user[0].email === req.body["email"]
    ) {
      req.session.isLoggedIn = true;
      req.session.userId = user[0].id;
      req.session.user = user[0];
      req.session.userName = `${user[0].first_name} ${user[0].last_name}`;

      // Record the register in user_activity
      await db.recordRegisterActivity(user[0].id);

      res.redirect("/");
    } else {
      res.render("login", {
        error_message: CREATE_FAILED,
        email: req.body["email"]
      });
    }
  } catch (error) {
    console.error("Query failed!", error);
    res.render("login", { error_message: DB_ERROR });
  }
});

router.get("/logout", function (req, res) {
  if (req.session.isLoggedIn) {
    const userId = req.session.userId;
    req.session.destroy(async function (err) {
      // Record the logout in user_activity
      await db.recordLogoutActivity(userId);

      if (err) {
        console.error(err);
      }
      res.render("login");
    });
  } else {
    console.error("Cannot logout: no user is currently logged in");
  }
});

export default router;
