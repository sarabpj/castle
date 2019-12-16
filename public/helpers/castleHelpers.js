"use strict";
import castle from "@castleio/sdk";

const castleApi = new castle.Castle({ apiSecret: process.env.CASTLE_API_KEY });


export const castleLoginSucceeded = async (user, req) => {
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
    // I think the session should only be set if approved is retur
    console.log("login succeeded event")
    return response;
  } catch (e) {
    console.error(e);
  }
};

export const castleLoginFailed = async (user, req) => {
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

// update to use track
export const castleLogoutSucceeded = async (user, req) => {
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

