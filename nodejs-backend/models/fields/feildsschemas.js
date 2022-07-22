const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const stringSchema = new Schema({
    type: {
        type: String,
        immutable: true,
        default: 'String',
    },
});

const numberSchema = new Schema({
    type: {
        type: String,
        immutable: true,
        default: 'Number',
    },
});

module.exports = {
    stringSchema,
    numberSchema,
}