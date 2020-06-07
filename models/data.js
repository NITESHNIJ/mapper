// WEEK 3...
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    xyz:{
        type: String
    },
    latitude: {
        type: String,
        required: true,
        unique: false
    },
    longitude: {
        type: String,
        required: true,
        unique: false
    },
    level: {
        type: String,
        required: true,
        unique: false
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

var Data = mongoose.model('Data',dataSchema);

module.exports = Data;

