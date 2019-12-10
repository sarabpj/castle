var express = require("express");
var router = express.Router();

const users = {
  1: {
    username: "beattles",
    password: "cometogether"
  },
  2: {
    username: "jcash",
    password: "walktheline"
  },
  3: {
    username: "ndiamond",
    password: "sweetcaroline"
  }
};

const authenticateUser = function(loginInfo) {
  if (loginInfo)
  /* checks if login matches a keyvalue in the users object */
    for (let key in users) {
      if (JSON.stringify(loginInfo) === JSON.stringify(users[key])) {
        return true;
      }
    }
  else {
    return false;
  }
};

/* GET home page. */
router.get("/", function(req, res, next) {
  console.log(req.session)
  if (req.session.username) {
    res.render("index", { username: req.session.username });
  } else {
    res.render("form", { error: false });
  }
});

/* POST login page. */
router.post("/", function(req, res, next) {
  var authorizedUser = authenticateUser(req.body);

  if (authorizedUser) {
    /* If the user is authorized add username to session */
    req.session.username = req.body.username;
    res.render("index", { error: false, username: req.body.username });
  } else {
    /* Render login form and display error */
    res.render("form", { error: true });
  }
});

/* POST logout route. */
router.post("/logout", function(req, res, next) {
  req.session.destroy(err => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
