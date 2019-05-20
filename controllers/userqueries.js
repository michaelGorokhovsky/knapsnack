const path = require('path');
const UserQuery = require('../models/userqueries');

exports.index = function (req, res) {
    res.sendFile(path.resolve('views/userqueries.html'));
};

exports.create = function (req, res) {
    var newQuery = new UserQuery(req.body);
    console.log(req.body);
    newQuery.save(function (err) {
            if(err) {
        	console.log('error saving query to db');    
		res.status(400).send('Unable to save query to database');
        } else {
	console.log('saved to db');
 // res.redirect('/userqueries/getquery');
        }
  });
               };

exports.list = function (req, res) {
        UserQuery.find({}).exec(function (err, userqueries) {
                if (err) {
                        return res.send(500, err);
                }
                //res.render('getquery', {
                //        userqueries: userqueries
             //});
        });
};
