var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fname:'String',
    userId: 'String',
    lname:'String',
    email:'String',
    password:'String',
    phone:'String',
    department:'String',
    role:'String'
})

mongoose.model('User', userSchema);
module.exports = mongoose.model('User')