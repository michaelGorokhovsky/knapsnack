const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserQuery = new Schema ({
        radius: { type: String, required: true },
        budget: { type: String, required: true },
	keyword: {type: String, required: false},
	longitude: { type: String, required: true },
        latitude: {type: String, required: true},

});

module.exports = mongoose.model('UserQuery', UserQuery)
