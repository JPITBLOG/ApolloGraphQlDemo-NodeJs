'use strict';

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        default: Date.now
    },
    imgUrl: {
        type: String,
        required: false
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pinCode: {
        type: Number,
        required: true
    },
    isDelete: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Students', studentSchema);