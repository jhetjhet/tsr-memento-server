const mongoose = require('mongoose');
const { Schema } = mongoose;
const fieldsModel = require('../fields');
const entryModel = require('../entries');

const recordSchema = new Schema({
    to: { // owner of this record (User model)
        type: Schema.Types.ObjectId,
        required: true,
        immutable: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
    background: String,
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