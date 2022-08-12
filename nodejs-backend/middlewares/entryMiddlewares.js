const { Schema, default: mongoose } = require('mongoose');
const entries = require('../models/entries');
const utils = require('../utils');

const create = async (req, res, next) => {
    const recordDoc = req.record_doc;
    let data = req.body;
    let TempEntry;
    try {
        await recordDoc.populate('fields');
        const schemaStruct = utils.recordFieldsToEntrySchema(recordDoc.fields);
        const schema = new Schema(schemaStruct);
        const entry_id = mongoose.Types.ObjectId();
        data = utils.cleanObj(data, Object.keys(schemaStruct));
        data._id = entry_id;
        data._record = recordDoc._id;

        TempEntry = new entries.TemporaryEntryModel(schema, entry_id);
        
        await TempEntry.model.validate(data);

        const entryDoc = await TempEntry.model.create(data);
        
        return res.json(entryDoc);
    } catch (error) {
        return next(error);
    } finally {
        if(TempEntry instanceof entries.TemporaryEntryModel)
            TempEntry.clean();
    }
}

const lists = async (req, res, next) => {
    const recordDoc = req.record_doc;
    try {
        const entryLists = await entries.EntrySchema.find({_record: recordDoc._id}).lean();
        return res.json(entryLists);
    } catch (error) {
        return next(error);
    }
}

const retrieve = async (req, res, next) => {
    const { entry_id } = req.params;
    const recordDoc = req.record_doc;
    try {
        const entryDoc = await entries.EntrySchema.findOne({_id: entry_id, _record: recordDoc._id}).lean();
        if(!entryDoc)
            return res.status(404).end();
        return res.json(entryDoc);
    } catch (error) {
        return next(error);
    }
}

const update = async (req, res, next) => {
    const { entry_id } = req.params;
    const recordDoc = req.record_doc;
    let data = req.body;
    let TempEntry;
    try {
        const entryDocExists = await entries.EntrySchema.exists({_id: entry_id, _record: recordDoc._id});
        if(!entryDocExists)
            return res.status(404).end();

        await recordDoc.populate('fields');
        const schemaStruct = utils.recordFieldsToEntrySchema(recordDoc.fields);
        const schema = new Schema(schemaStruct);
        const fieldKeys = Object.keys(schemaStruct);
        
        data = utils.cleanObj(data, fieldKeys);

        TempEntry = new entries.TemporaryEntryModel(schema, entry_id);

        const filterQuery = {_id: entry_id};
        const queryOptions = {
            lean: true,
            new: true,
            runValidators: true,
        }
        const entryDoc = await TempEntry.model.findOneAndUpdate(filterQuery, data, queryOptions);
        return res.json(entryDoc);
    } catch (error) {
        return next(error);
    } finally {
        if(TempEntry instanceof entries.TemporaryEntryModel)
            TempEntry.clean();
    }
}

const _delete = async (req, res, next) => {
    const { entry_id } = req.params;
    const recordDoc = req.record_doc;
    try {
        const delRes = await entries.EntrySchema.deleteOne({_id: entry_id, _record: recordDoc._id});
        if(delRes.deletedCount === 0)
            return delRes.status(404).end();
        
        return res.status(201).end();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    create,
    lists,
    retrieve,
    update,
    delete: _delete,
};