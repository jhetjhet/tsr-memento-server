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

const booleanSchema = new Schema({
    type: {
        type: String,
        immutable: true,
        default: 'Boolean',
    },
});

const dateSchema = new Schema({
    type: {
        type: String,
        immutable: true,
        default: 'Date',
    },
});

module.exports = {
    stringSchema,
    numberSchema,
    booleanSchema,
    dateSchema,
}