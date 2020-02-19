'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIEDEX = require('./movies-data.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authVal = req.get('Authorization') || '';

  if(!authVal.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Must provide Bearer Authorization'});
  }

  const token = authVal.split(' ')[1];
  if(token !== apiToken) {
    return res.status(401).json({error: 'Must provide valid token'});
  }

  next();
});

function handleGetMovie(req, res) {
  let response = MOVIEDEX;

  if(req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  if(req.query.genre) {
    response = response.filter(movie => 
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  if(req.query.avg_vote) {
    response = response.filter(movie =>
      movie.avg_vote >= Number(req.query.avg_vote)
    );
  }

  // if(req.query.avg_vote) {
  //   response.sort((a, b) => {
  //     return a[req.query.avg_vote] < b[req.query.avg_vote] ? -1 : 1;
  //   });
  // }

  res.json(response);
}



app.get('/movie', handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
