const express = require('express');
const router = express.Router();
const query = require('../controllers/userqueries');

router.get('/', function(req, res){
    query.index(req,res);
});

router.post('/addquery', function(req, res) {
  console.log("sending query to router");
  //console.log(req);
 query.create(req,res);
  res.status(204).send();
});

router.get('/getquery', function(req, res) {
   query.list(req,res);
});

module.exports = router;
