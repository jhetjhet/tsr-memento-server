const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordSchema = new Schema({
    _schema: {
        type: Schema.Types.ObjectId,
        ref: 'RecordFormatSchema',
        required: true,
        immutable: true,
    },
}, {
    collection: 'records',
});

const RecordSchema = mongoose.model('RecordSchema', recordSchema);

async function validateByRecordSchema(schema, data){
    if(!(schema instanceof Schema)){
        throw new Error('Object is not an instance of Schema');
    }
    RecordSchema.schema = schema;
    await RecordSchema.validate(data);
}

module.exports = {
    validateByRecordSchema,
    RecordSchema,
}