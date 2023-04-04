require("dotenv").config();

const { response } = require("express");
const express = require("express");
const router = express.Router();
const connection = require("../utils/connection");

const bcrypt = require("bcrypt");
const saltRounds = 10;

var sql;

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
  if (!username && !password)
    throw new Error("Username and/or Password Must not be Empty!");

  sql = `SELECT * FROM user WHERE USERNAME = ?`;

  connection.query(sql, [username], function (err, result, field) {
    if (err) throw err;
    if (result.length < 1) {
      return res.send({ ECode: 20, EMsg: "Username Not Found!" });
    }
    bcrypt.compare(password, result[0].PASSWORD).then(function (result2) {
      if (err) {
        return res.send({ ECode: 20, EMsg: "Auth Failed" });
      }
      if (!result2) {
        return res.send({ ECode: 20, EMsg: "Wrong password" });
      }

      req.session.loggedin = true;
      req.session.role = result[0].ROLE;
      req.session.username = result[0].USERNAME;
      data.uid = result[0].ID;
      data.username = result[0].USERNAME;
      data.role = result[0].ROLE;

      res.send(data);
    });
  });
});

// router.post("/", (req, res) => {
//   let username = req.body.username;
//   let password = req.body.password;
//   let data = {
//     ECode: 0,
//     EMsg: "",
//   };

//   if (username && password) {
//     connection.query(
//       "SELECT * FROM user WHERE USERNAME = ?",
//       [username],
//       function (error, results, fields) {
//         // If there is an issue with the query, output the error
//         if (error) throw error;
//         if (results.length < 1) {
//           throw new Error("");
//         }
//         // If the account exists
//         if (results.length > 0) {
//           bcrypt.compare(password, results[0].PASSWORD).then(function (result) {
//             console.log(results);
//             // Authenticate the user
//             req.session.loggedin = true;
//             req.session.role = results[0].ROLE;
//             req.session.username = results[0].USERNAME;
//             // Redirect to home page
//             data.uid = results[0].ID;
//             data.username = results[0].USERNAME;
//             //data.password = results[0].PASSWORD;
//             data.role = results[0].ROLE;
//             console.log(data);
//             res.send(data);
//           });
//         } else {
//           data.ECode = 20;
//           data.EMsg = "Username Not Found!";
//           res.send(data);
//         }
//         res.end();
//       }
//     );
//   } else {
//     data.ECode = 20;
//     data.EMsg = "Username and/or Password Must not be Empty!";
//     res.send(data);
//     res.end();
//   }
// });

module.exports = router;
