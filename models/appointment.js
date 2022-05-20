const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dateInput: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: String,
        required: true
    },
    Contact: {
        type: String,
        required: true,
    }
})


const Appointment = mongoose.model('bby-10-appointments', appSchema);

module.exports = Appointment;