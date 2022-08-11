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

class TemporaryEntryModel {
    
    constructor(schema, id=null){
        this.validationModelName = `${TEMP_MODEL_NAME_PREFIX}-${id || v4()}`;
        this.tempModel = EntrySchema.discriminator(this.validationModelName, schema);
    }
    
    get model(){
        return this.tempModel;
    }

    clean(){
        mongoose.connection.deleteModel(this.validationModelName);
        delete EntrySchema.discriminators[this.validationModelName];
    }

    static cleanAll(){
        const patt = new RegExp(`^${TEMP_MODEL_NAME_PREFIX}.+`, 'g');
        mongoose.connection.deleteModel(patt);
        Object.keys(EntrySchema.discriminators).forEach((k) => {
            delete EntrySchema.discriminators[k];
        });
    }
}

module.exports = {
    EntrySchema,
    TemporaryEntryModel,
}