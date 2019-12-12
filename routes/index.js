"use strict";
import express from "express";
import castle from "@castleio/sdk";

const router = express.Router();
const castleApi = new castle.Castle({ apiSecret: process.env.CASTLE_API_KEY });

const users = [
  {
    id: 1,
    email: "beattles@example.com",
    username: "beattles",
    password: "cometogether"
  },
  {
    id: 2,
    email: "jcash@example.com",
    username: "jcash",
    password: "walktheline"
  },
  {
    id: 3,
    email: "ndiamond@example.com",
    username: "ndiamond",
    password: "sweetcaroline"
  }
];

const authenticateUser = function(loginInfo) {
  const userArray = users.filter(user => {
    return (
      loginInfo.email === user.email && loginInfo.password === user.password
    );
  });

  const validEmail = users.find(user => user.email === loginInfo.email)
  // check if email is there then send id or just default to null
  const invalidLogin = {
    id: validEmail === undefined ? undefined : validEmail['id'],
    email: loginInfo.email
  };

  // assuming there is a single user
  return userArray && userArray.length > 0 ? userArray[0] : invalidLogin;
};

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

const userLoginSucceeded = async (user, req) => {
  let response;
  try {
    const response = await castleApi.authenticate({
      event: "$login.succeeded",
      user_id: user.id,
      user_traits: {
        email: user.email,
        registered_at: "2015-02-23T22:28:55.387Z"
      },
      context: {
        ip: req.ip,
        client_id: req.cookies["__cid"],
        headers: req.headers
      }
    });
    console.log("login succeeded event")
    return response;
  } catch (e) {
    console.error(e);
  }
};

const userLoginFailed = async (user, req) => {
  let response;
  try {
    const response = await castleApi.authenticate({
      event: "$login.failed",
      user_id: user.id,
      user_traits: {
        email: user.email,
        registered_at: "2015-02-23T22:28:55.387Z"
      },
      context: {
        ip: req.ip,
        client_id: req.cookies["__cid"],
        headers: req.headers
      }
    });
    /* return different flows for the various actions */
    console.log("login failed event")
    return response;
  } catch (e) {
    console.error(e);
  }
};

const userLogoutSucceeded = async (user, req) => {
  let response;
  try {
    const response = await castleApi.authenticate({
      event: "$logout.succeeded",
      user_id: user.id,
      user_traits: {
        email: user.email,
        registered_at: "2015-02-23T22:28:55.387Z"
      },
      context: {
        ip: req.ip,
        client_id: req.cookies["__cid"],
        headers: req.headers
      }
    });
    console.log("logout succeeded event")
    return response;
  } catch (e) {
    console.error(e);
  }
};

/* POST login page. */
router.post("/", function(req, res, next) {
  const user = authenticateUser(req.body);

  if (user.password) {
    userLoginSucceeded(user, req);
    req.session.email = req.body.email;
    req.session.user_id = user.id;
    res.render("index", {
      error: false,
      username: user.username,
      user_id: user.id,
      userLoggedIn: true
    });
  } else {
    userLoginFailed(user, req)
    res.render("form", { error: true, userLoggedIn: false });
  }
});

/* POST logout route. */
router.post("/logout", function(req, res, next) {
  userLogoutSucceeded(req.session, req);
  req.session.destroy(err => {
    if (err) {
      return console.log(err);
    }

    res.redirect("/");
  });
});

export { router as indexRouter };
