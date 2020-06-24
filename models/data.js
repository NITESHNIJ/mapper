
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    level: {
        type: Array
    },
    temprature: {
        type: Array
    },
    alert: {
        type: Boolean,
        default: false
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    high: {
        type: String
    },
    low: {
        type: String
    }

},{
    timestamps: true
});

var Data = mongoose.model('Data',dataSchema);

module.exports = Data;

