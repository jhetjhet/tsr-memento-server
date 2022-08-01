const mongoose = require('mongoose');
const { Schema } = mongoose;

const entrySchema = new Schema({
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

async function validateByEntrySchema(schema, data, pathsToValidate=null){
    if(!(schema instanceof Schema)){
        throw new Error('Object is not an instance of Schema');
    }
    EntrySchema.schema = schema;
    await EntrySchema.validate(data, pathsToValidate);
}

module.exports = {
    validateByEntrySchema,
    EntrySchema,
}