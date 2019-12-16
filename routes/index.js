"use strict";
import express from "express";
import { authenticateUser } from "../public/helpers/authHelpers.js";
import {
  castleLoginSucceeded,
  castleLoginFailed,
  castleLogoutSucceeded
 } from "../public/helpers/castleHelpers.js"

const router = express.Router();



/* GET home page. */
router.get("/", function(req, res, next) {
  const userProfile = JSON.parse(JSON.stringify(req.session));

  if (userProfile.username) {
    res.render("index", {
      username: req.session.username,
      userLoggedIn: true,
      user_id: req.session.user_id
    });
  } else {
    res.render("form", {
      error: false,
      userLoggedIn: false
    });
  }
});


/* POST login page. */
router.post("/", function(req, res, next) {
  const user = authenticateUser(req.body);

  if (user.password) {
    castleLoginSucceeded(user, req);
    // check if the action from from castle i
    req.session.email = req.body.email;
    req.session.user_id = user.id;
    res.render("index", {
      error: false,
      username: user.username,
      user_id: user.id,
      userLoggedIn: true
    });
  } else {
    castleLoginFailed(user, req)
    res.render("form", { error: true, userLoggedIn: false });
  }
});

/* POST logout route. */
router.post("/logout", function(req, res, next) {
  castleLogoutSucceeded(req.session, req);
  req.session.destroy(err => {
    if (err) {
      return console.log(err);
    }

    res.redirect("/");
  });
});

export { router as indexRouter };
