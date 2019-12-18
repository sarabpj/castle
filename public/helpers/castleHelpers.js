"use strict";
import castle from '@castleio/sdk';
import url from 'url';
import session from "express-session";

const castleApi = new castle.Castle({ apiSecret: process.env.CASTLE_API_KEY });

const castleLoginSucceeded = async (user, req, res) => {
  let response;
  try {
    const response = await castleApi.authenticate({
      event: "$login.succeeded",
      user_id: user.id,
      user_traits: {
        email: user.email,
        registered_at: user.registered_at
      },
      context: {
        ip: req.ip,
        client_id: req.cookies["__cid"],
        headers: req.headers
      }
    });
    switch(response.action) {
       case "allow": {
          console.log("Welcome user");
          req.session.email = req.body.email;
          req.session.user_id = user.id;
          return res.render("index", {
            error: false,
            username: user.username,
            user_id: user.id,
            userLoggedIn: true,
            action: "allow"
          });
          break;
       }
       case "challenge": {
          console.log("Ask security question");
          return  res.redirect(url.format({
            pathname:"/challenge",
            query: {
              username: user.username,
              user_id: user.id,
              email: user.email,
              action: "challenge",
              error: false,
              userLoggedIn: false
            }
          }));
          break;
       }
       case "deny": {
          console.log("Send user and team warning");
          break;
       }
       default: {
          console.log("Invalid option");
          break;
       }
     }
    return response;
  } catch (e) {
    console.error(e);
  }
};

const castleLoginFailed = async (user, req) => {
  let response;
  try {
    const response = await castleApi.authenticate({
      event: "$login.failed",
      user_id: user.id,
      user_traits: {
        email: user.email,
        registered_at: user.registered_at
      },
      context: {
        ip: req.ip,
        client_id: req.cookies["__cid"],
        headers: req.headers
      }
    });

    return response;
  } catch (e) {
    console.error(e);
  }
};

const castleLogoutSucceeded = async (user, req) => {
  let response;
  try {
    const response = await castleApi.authenticate({
      event: "$logout.succeeded",
      user_id: user.id,
      user_traits: {
        email: user.email,
        registered_at: user.registered_at
      },
      context: {
        ip: req.ip,
        client_id: req.cookies["__cid"],
        headers: req.headers
      }
    });
    console.log(response)
    return response;
  } catch (e) {
    console.error(e);
  }
};

export { castleLoginSucceeded, castleLoginFailed, castleLogoutSucceeded };
