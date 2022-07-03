const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/storeApi');
mongoose.Promise = global.Promise;
mongoose.connection;

module.exports = mongoose