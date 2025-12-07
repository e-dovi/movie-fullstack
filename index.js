require('dotenv').config();
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
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
      if (err) return res.sendStatus(403); // Forbidden
      else return next();
    });
  } else {
    return res.sendStatus(403);
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

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// Send email route
app.post('/send', verifyToken, async (req, res) => {
  const txt = req.body.txt;
  const recipient = req.body.recipient;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: 'Movies watchlist',
    text: `Here are the movies you chose to watch later: ${txt} Thanks!`,
    html: `<strong>Here are the movies you chose to watch later: </strong>
           <p style="color:navy;">${txt}</p>
           <p>Thanks!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
    res.status(200).send('Email sent...');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

// Movie API route
app.get('/get-movie/:movie', verifyToken, async (req, res) => {
  const url = 'https://api.themoviedb.org/3/search/movie?query=';
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
