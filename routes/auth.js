const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { checkAuth } = require("../middlewares/auth.js");

// create connection to mysql database
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});
//regex for validating inputs
const nameRegex = /^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// example route that requires authentication
router.get("/protected", checkAuth, (req, res) => {
  res.status(200).json({
    message: "You are logged in",
  });
});

// login route
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // check for empty fields
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter email and password" });
  }

  // check if email exists in database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        const user = results[0];

        // compare password hash
        bcrypt.compare(password, user.password, function (err, match) {
          if (err) throw err;

          if (match) {
            // login successful, create a JWT token
            const token = jwt.sign({ userId: user.id }, "secret-key", {
              expiresIn: "1h",
            });

            res.status(200).json({
              message: "Login successful",
              token: token,
            });
          } else {
            // password incorrect
            res.status(401).json({
              error: "Invalid email or password",
            });
          }
        });
      } else {
        // email not found
        res.status(401).json({
          error: "Invalid email or password",
        });
      }
    }
  );
});

// signup route
router.post("/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const state = req.body.state;

  // Check if all fields are filled
  if (!name || !email || !password || !state) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // Validate inputs using regex patterns
  const validName = nameRegex.test(name);
  const validEmail = emailRegex.test(email);

  if (!validName) {
    // Send error response if any input is invalid
    return res.status(400).json({ error: "Invalid name" });
  }

  if (!validEmail) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // Query the database to check if email already exists
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (error, results, fields) {
      // If a user with the email already exists, send an error response
      if (results.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hash password
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) throw err;

        // Save user to database
        connection.query(
          "INSERT INTO users (name, email, password, state) VALUES (?, ?, ?, ?)",
          [name, email, hash, state],
          function (error, results, fields) {
            if (error) throw error;

            return res
              .status(201)
              .json({ message: "User created successfully" });
          }
        );
      });
    }
  );
});

// middleware function to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secret-key", function (err, decoded) {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.userId = decoded.userId;
    next();
  });
}

// route to get user details
router.get("/user", verifyToken, function (req, res) {
  const userId = req.userId;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        const user = results[0];
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  );
});

router.post("/signout", (req, res) => {
  // Clear the JWT token from the client-side cookie or local storage
  res.clearCookie("token");
  // send a success message
  res.status(200).json({ message: "Signout successful" });
});

module.exports = router;
