
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

var Forgot = mongoose.model('Forgot',forgotSchema);

module.exports = Forgot;

