const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordSchema = new Schema({}, {
    collation: 'records',
});

RecordSchema = mongoose.model('RecordSchema', recordSchema)

module.exports = function(schema){
    if(!(schema instanceof Schema)){
        throw new Error('Object is not an instance of Schema');
    }
    RecordSchema.schema = schema;
    return RecordSchema;
};