const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4 } = require('uuid');

const TEMP_MODEL_NAME_PREFIX = 'T_ENTRY_M'

const entrySchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
        immutable: true,
    },
    _record: {
        type: Schema.Types.ObjectId,
        ref: 'RecordSchema',
        required: true,
        immutable: true,
    },
}, {
    collection: 'entries',
});

const EntrySchema = mongoose.model('EntrySchema', entrySchema);

function validateByEntrySchema(schema, data, pathsToValidate=null){
    if(!(schema instanceof Schema)){
        throw new Error('Object is not an instance of Schema');
    }

    const validationModelName = `${VALIDATION_MODEL_NAME_PREFIX}-${v4()}`;
    // temporary model using specified schema for dynamic field validation
    // Note: this method seems to be not optimize but currently this is the best way i think :)
    const EntryValidationModel = EntrySchema.discriminator(validationModelName, schema);

    return new Promise(function(resoleve, reject){
        async function vald(){
            try {
                await EntryValidationModel.validate(data, pathsToValidate);
                resoleve(data);
            } catch (error) {
                reject(error);
            } finally{
                mongoose.deleteModel(validationModelName);
            }
        }

        vald();
    });
}

module.exports = {
    validateByEntrySchema,
    EntrySchema,
}