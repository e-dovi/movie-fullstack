const express = require('express');
const app = express();
const sgMail = require('@sendgrid/mail');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
sgMail.setApiKey(process.env.sg_KEY);

app.use(cookieParser());
app.use(express.json());

const verifyToken = (req, res, next) => {
  
  if((req.cookies) && (req.cookies.access_token)){

    const tkn = req.cookies.access_token.split(' ')[1];

    jwt.verify(tkn, process.env.JWT_KEY, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden
       // Attach user info to the request
      else{
       return next();
      }
    });   
  }
  else{
    return res.sendStatus(403);
  }
}

app.get('/', (req, res) => {

  const date = new Date()
  const ip = req.ip;

  if(ip){
    const data = {ip, date};
  //console.log(`data: ${data}`);


  var token = jwt.sign(data, process.env.JWT_KEY);
  //console.log(token);

  res.cookie('access_token', 'Bearer ' + token, {
    expires: new Date(Date.now() + 300000),
  })

  res.sendFile(path.join(__dirname, 'front', 'build', 'index.html'));
  }

  else{
    res.sendStatus(403);
  }
});
app.use(express.static(path.join(__dirname, 'front', 'build')));


app.post('/send', verifyToken, (req, res) => {
    const txt = req.body.txt;
    const recipient = req.body.recipient;

        const msg = {
            to: recipient, // Change to your recipient
            from: 'searchmovieapi@gmail.com', // Change to your verified sender
            subject: 'Movies watchlist',
            text: `Here are the movies you chose to watch later: ${txt} Thanks!`,
            html: `<strong>Here are the movies you chose to watch later: </strong> <p style="color:navy;"> ${txt} <p>  <p>Thanks!</p>`,
          }

          sgMail
            .send(msg)
            .then(() => {
              console.log('Email sent')
              res.status(200).send('Email sent...');
            })
            .catch((error) => {
              console.error(error)
            })
    
    })

app.get('/get-movie/:movie', verifyToken, async (req, res) => {
  const url = 'https://api.themoviedb.org/3/search/movie?query=';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.API_KEY}`,
    }
  };


  //input sanitation should be done before making API request
  console.log(req.params)
  try{
    const response = await fetch(url+req.params.movie, options)
    if (response.ok){
      
      const jsonResponse = await response.json();
    
      res.json(jsonResponse) 
    }
    else{
      res.sendStatus(500);
    }
  }
  catch(error){
    console.log(error)
    res.sendStatus(500);
  }
})


    const PORT = process.env.PORT || 4001;
    app.listen(PORT, ()=>{
        console.log(`Listening on port ${PORT}...`);
    })

