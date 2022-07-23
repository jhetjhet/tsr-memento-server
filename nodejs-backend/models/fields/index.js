
const mongoose = require('mongoose');
const fieldSchemas = require('./fieldSchemas');

const FIELDS_SCHEMAS = Object.keys(fieldSchemas);
const FIELD_MODELS = FIELDS_SCHEMAS.map((fs) => fs[0].toUpperCase() + fs.substring(1));

// Base schema for all kind of fields
const fieldSchema = new mongoose.Schema({
    field_type: {
        type: String,
        required: true,
        immutable: true,
        enum: FIELD_MODELS,
    },
    field_name: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        default: false,
    },
    immutable: {
        type: Boolean,
        default: false,
    },
}, {
    discriminatorKey: 'field_type',
});

const FieldSchema = mongoose.model('FieldSchema', fieldSchema);

const EXPORTS = {
    FIELD_MODELS,
    FieldSchema,
};

FIELD_MODELS.forEach((fn, i) => {
    EXPORTS[fn] = FieldSchema.discriminator(fn, fieldSchemas[FIELDS_SCHEMAS[i]]);
});

module.exports = {
    ...EXPORTS,
}