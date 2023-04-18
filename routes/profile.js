const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const { checkAuth } = require('../middlewares/auth.js');
const jwt = require('jsonwebtoken');

// create connection to mysql database
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// middleware function to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'secret-key', function (err, decoded) {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
}

//   include the middleware

router.post('/new', verifyToken, async (req, res) => {
  console.log(req.headers.authorization);

  const { first_name, last_name, dob, gender, username } = req.body;

  // Check if all inputs are present in req.body
  if (!first_name || !last_name || !dob || !gender || !username) {
    return res.status(400).json({ error: 'Missing required input.' });
  }

  try {
    const sql = `INSERT INTO users (
			first_name, last_name, dob, gender, username
			) VALUES (?, ?, ?, ?, ?)`;

    const values = [first_name, last_name, dob, gender, username];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create transaction.' });
      } else {
        return res.status(200).json(result);
      }
    });
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
});

module.exports = router;
