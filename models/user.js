
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    usertype: {
        type: String
    },
    parentid: {
        type: String
    },
    companyname: {
        type: String
    },
    name: {
        type: String
    },
    typeofdatabase: {
        type: String
    },
    companylogo: {
        type: String
    },
    userpic: {
        type: Object
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',User);