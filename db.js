const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/E-com';

function DBconnect() {
    mongoose.connect(dbUrl);
}

module.exports =  DBconnect;