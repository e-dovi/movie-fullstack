require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

// Middleware to verify JWT from cookie
const verifyToken = (req, res, next) => {
  if (req.cookies && req.cookies.access_token) {
    const tkn = req.cookies.access_token.split(' ')[1];
    jwt.verify(tkn, process.env.JWT_KEY, (err, user) => {
      if (err) return res.status(403).json({error:"Unable to verify user. Try reloading Home Page to restore session."}); // Forbidden
      else return next();
    });
  } else {
    return res.status(403).json({error:"Unable to verify user. Try reloading Home Page."});
  }
};

// Root route
app.get('/', (req, res) => {
  const date = new Date();
  const ip = req.ip;

  if (ip) {
    const data = { ip, date };
    const token = jwt.sign(data, process.env.JWT_KEY);

    res.cookie('access_token', 'Bearer ' + token, {
      expires: new Date(Date.now() + 300000),
    });

    res.sendFile(path.join(__dirname, 'front', 'build', 'index.html'));
  } else {
    res.sendStatus(403);
  }
});

app.use(express.static(path.join(__dirname, 'front', 'build')));

// Movie API route
app.get('/get-movie/:movie', verifyToken, async (req, res) => {
  const url = process.env.TMDB_URL;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  };

  try {
    const response = await fetch(url + req.params.movie, options);
    if (response.ok) {
      const jsonResponse = await response.json();
      res.json(jsonResponse);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Start server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
