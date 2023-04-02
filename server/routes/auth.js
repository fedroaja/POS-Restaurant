require("dotenv").config();

const { response } = require("express");
const express = require("express");
const router = express.Router();
const connection = require("../utils/connection");

router.get("/", (req, res) => {
  if (req.session.loggedin === true) {
    res.send({ ECode: 0, role: req.session.role });
  } else {
    res.send({ ECode: 20 });
  }
});

router.delete("/logout", (req, res) => {
  req.session.destroy();
  res.send({ ECode: 0 });
});

router.post("/", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let data = {
    ECode: 0,
    EMsg: "",
  };

  if (username && password) {
    connection.query(
      "SELECT * FROM user WHERE USERNAME = ? AND PASSWORD = ?",
      [username, password],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
          // Authenticate the user
          req.session.loggedin = true;
          req.session.role = results[0].ROLE;
          req.session.username = results[0].USERNAME;
          // Redirect to home page
          data.uid = results[0].ID;
          data.username = results[0].USERNAME;
          data.password = results[0].PASSWORD;
          data.role = results[0].ROLE;
          res.send(data);
        } else {
          data.ECode = 20;
          data.EMsg = "Incorrect Username and/or Password!";
          res.send(data);
        }
        res.end();
      }
    );
  } else {
    data.ECode = 20;
    data.EMsg = "Incorrect Username and/or Password!";
    res.send(data);
    res.end();
  }
});

module.exports = router;
