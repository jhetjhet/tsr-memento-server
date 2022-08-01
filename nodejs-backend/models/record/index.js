const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordSchema = new Schema({
    to: {
        type: String,
        required: true,
        immutable: true,
    }, // django id (uuidv4)
    name: {
        type: String,
        required: true,
    },
    fields: [{
        type: Schema.Types.ObjectId,
        ref: 'FieldSchema'
    }],
});

module.exports = mongoose.model('RecordSchema', recordSchema);