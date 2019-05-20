const express = require('express');
const app = express();
const router = express.Router();
const db = require('./db');
const userqueries = require('./routes/userqueries');
const fs = require('fs');
const https = require('https');

const path = __dirname + '/views/';
const port = 8443;

var cert = fs.readFileSync('/etc/letsencrypt/live/knapsnack.online/fullchain.pem');
var key = fs.readFileSync('/etc/letsencrypt/live/knapsnack.online/privkey.pem');

var options = {
  key: key,
  cert: cert
};

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path));
app.use('/userqueries', userqueries);

var server = https.createServer(options, app);

server.listen(port, function () {
  console.log('Example app listening on port 8443!')
})

