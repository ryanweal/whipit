'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const nodeLimits = require('limits');
const cors = require('cors');

const twilioController = require('./controllers/twilioController.js');

const reqDuration = 2629746000; // 1-month hsts

// Catch-all for errors
function errorHandler(err, req, res, next) {
  if (err) {
    res.status(403).json({
      message: err
    });
  } else {
    res.status(500).json({
      message: 'Unknown error'
    });
  }
}

const app = express();
app.use(bodyParser.json({
  limit: '1mb' // limit string length
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(errorHandler);

// security by obscurity (helmet does this also)
app.disable('x-powered-by');

// helmet
app.use(helmet());

// hsts
app.use(helmet.hsts({
  maxAge: reqDuration
}));

// framebuster
app.use(helmet.frameguard({
  action: 'deny'
}));

// cors
app.use(cors({
  origin: '*'
}));

// content security policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["*"],
    scriptSrc: ["'self'"],
    childSrc: ["'none'"],
    objectSrc: ["*"],
    formAction: ["'none'"],
    connectSrc: ["'self'"],
    styleSrc:["'self' 'unsafe-inline'"]
  }
}));

// x-xss-protection (disabled for ie8/ie9 which opens vulnerability)
app.use(helmet.xssFilter());

// x-content-type-options
app.use(helmet.noSniff());

// limit some things
app.use(nodeLimits({
  file_uploads: false,
  post_max_size: 1000000, // 1mb max upload
  inc_req_timeout: 1000 * 60 // 60 seconds 
}))

const port = 4000;

app.get('/', (req, res) => res.send('Whip it good!'));
app.get('/:id/:message', (req, res, next) => twilioController.send(req, res));

app.listen(port, () => console.log(`info Express listening on port ${port}!`))
