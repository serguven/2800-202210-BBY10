const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    Qualification: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Number,
        required: true
    },
    openingtime: {
        type: Number,
        required: true
    },
    closingtime: {
        type: Number,
        required: true
    }
}, {timestamps: true});


const Doctor = mongoose.model('bby-10-doctorsinfo', doctorSchema);

module.exports = Doctor;