const mongoose = require('mongoose');
const { Schema } = mongoose;
// const { uuid } = require('uuidv4');
const { v4 } = require('uuid');

const fields = require('../fields');
// const { fieldSchema } = require('../fields/feildsschemas');

const FIELDS = fields.FIELD_MODELS;

const recordSchema = new Schema({
    to: {
        type: String,
        required: true,
    }, // django id (uuidv4)
    name: {
        type: String,
        required: true,
    },
    __fields__: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {},
        validate: function(map){

            const validated_map = new Map();
            for(var val of map.keys()){
                let fdata = map.get(val);
                fields.FieldSchema.validate(fdata);

                let model_class = fields[fdata.field_type];
                model_class.validate(fdata);

                validated_map.set(val, new model_class(fdata));
            }

            this.__fields__ = validated_map;
            return true;
        },
    },
});

recordSchema.virtual('fields').
    set(function(arr_fields) {
        if(!Array.isArray(arr_fields)){
            this.invalidate('fields', 'Must be an array');
            return;
        }

        arr_fields.forEach((field) => {
            this.__fields__.set(v4(), field);
        });
    });

exports.Record = mongoose.model('RecordSchema', recordSchema);