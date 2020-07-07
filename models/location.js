
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

var Location = mongoose.model('Location',locationSchema);

module.exports = Location;

