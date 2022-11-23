const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String
    },
    answer: {
        type: String
    },
    tags: {
        type: Array,
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('RAQ', questionSchema);