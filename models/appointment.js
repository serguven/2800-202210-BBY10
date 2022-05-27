const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    did: {
        type: String,
    },
    dname: {
        type: String,
    },
    name: {
        type: String,
    },
    dateInput: {
        type: Date,
    },
    text: {
        type: String,
    },
    time: {
        type: String,
    },
    Contact: {
        type: String,
    }
})


const Appointment = mongoose.model('bby-10-aapointments', appSchema);

module.exports = Appointment;