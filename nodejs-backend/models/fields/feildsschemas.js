const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const FIELD_OPTIONS = {
    autoCreate: false,
    id: false,
    _id: null,
}

const stringSchema = new Schema({
    type: {
        type: String,
        immutable: true,
        default: 'String',
    },
}, FIELD_OPTIONS);

const numberSchema = new Schema({
    type: {
        type: String,
        immutable: true,
        default: 'Number',
    },
}, FIELD_OPTIONS);

module.exports = {
    stringSchema,
    numberSchema,
}