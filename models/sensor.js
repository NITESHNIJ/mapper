
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    unit: {
        type: String
    },
    sensor_type: {
        type: String
    },
    data_type: {
        type: String
    },
    min_range: {
        type: Number
    },
    max_range: {
        type: Number
    },
    descrete_values: {
        type: Array
    }
},{
    timestamps: true
});

var Sensor = mongoose.model('Sensor',sensorSchema);

module.exports = Sensor;

