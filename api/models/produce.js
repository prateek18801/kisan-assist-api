const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema({
    produce_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Produce', produceSchema);