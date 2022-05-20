const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    Name: {
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
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Contact: {
        type: String,
        required: true
    },
    openAt: {
        type: String,
        required: true,
    },
    closeAt: {
        type: String,
        required: true,
    }
})


const Doctor = mongoose.model('psychiatrists', docSchema);

module.exports = Doctor;