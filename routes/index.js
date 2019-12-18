"use strict";
import express from "express";
import url from "url";
import { authenticateUser } from "../public/helpers/authHelpers.js";
import {
  castleLoginSucceeded,
  castleLoginFailed,
  castleLogoutSucceeded
} from "../public/helpers/castleHelpers.js";

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
   return castleLoginSucceeded(user, req, res);

  } else {
    castleLoginFailed(user, req)
    res.render("form", { error: true, userLoggedIn: false });
  }
});

/* GET security question form page. please note permissions are not set */
router.get("/challenge", function(req, res, next) {
  const url_parts = url.parse(JSON.stringify(req.url), true);
  const query = url_parts.query;

  res.render("securityQuestionForm", {
    error: false,
    userLoggedIn: false,
    username: query.username,
    user_id: query.user_id,
    email: query.email
  });
});

/* POST security question form page. */
router.post("/challenge", function(req, res, next) {
  if(req.body.answer === 'dog'){
    req.session.email = req.body.email;
    req.session.user_id = req.body.user_id;

    res.render("index", {
      username: req.body.username,
      userLoggedIn: true,
      user_id: req.session.user_id
    });
  }else{
    res.render("securityQuestionForm", {
      error: true,
      userLoggedIn: false,
      username: req.body.username,
      user_id: req.body.user_id,
      email: req.body.email
    });
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
