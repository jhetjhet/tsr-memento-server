const mongoose = require('mongoose');
const { Schema } = mongoose;
const fieldsModel = require('../fields');
const entryModel = require('../entries');

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
    description: String,
    fields: [{
        type: Schema.Types.ObjectId,
        ref: 'FieldSchema'
    }],
});

recordSchema.pre('remove', {
    document: true,
    query: false,
}, async function(next){
    try {
        await fieldsModel.FieldSchema.deleteMany({_id: {$in: this.fields}});
        await entryModel.EntrySchema.deleteMany({_record: this._id});
    } catch (error) {
        next(error);
    }
    next();
});

module.exports = mongoose.model('RecordSchema', recordSchema);