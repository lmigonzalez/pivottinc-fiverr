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
  jwt.verify(token, 'secret-key', function (error, decoded) {
    if (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.userId;
    next();
  });
}

//   include the middleware

router.get('/', async (req, res) => {
  try {
    const q = 'SELECT * FROM users';
    connection.query(q, async (error, result) => {
      if (error) {
        res.status(404).json({
          message: error,
        });
        return;
      }
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

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

    connection.query(sql, values, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create transaction.' });
      } else {
        return res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

router.get('/get-user/:id', (req, res) => {
  const id = req.params.id;
  let q = 'SELECT * FROM cards WHERE UserId = ?';
  try {
    connection.query(q, [id], (error, result) => {
      if (error) {
        res.status(404).json({
          message: error,
        });
        return;
      }
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

router.patch('/update-user', (req, res) => {
  const { first_name, last_name, dob, gender, username, Id } = req.body;
  const q =
    'UPDATE users SET first_name = ?, last_name = ?, dob = ?, gender = ?, username = ? WHERE ID = ?';

  try {
    connection.query(
      q,
      [first_name, last_name, dob, gender, username, Id],
      (error, result) => {
        if (error) {
          res.status(404).json({
            message: error,
          });
          return;
        }
        res.status(200).json(result);
      }
    );
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

router.delete('/delete-user', (req, res) => {
  const id = req.body.id;
  const q = 'DELETE FROM users WHERE ID = ?';
  try {
    connection.query(q, [id], (error, result) => {
      if (error) {
        res.status(404).json({
          message: error,
        });
        return;
      }
      res.status(200).json(result);
    });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
});

module.exports = router;
