const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const codeSchema = new Schema({
    locationid: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

var Code = mongoose.model('Code',codeSchema);

module.exports = Code;

