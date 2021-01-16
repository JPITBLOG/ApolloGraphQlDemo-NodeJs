'use strict'

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const markSchema = new schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    marks: {
        type: Number,
        required: true
    },
    isDelete: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('studentMarks', markSchema);