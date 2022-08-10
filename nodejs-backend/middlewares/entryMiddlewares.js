const { Schema } = require('mongoose');
const entries = require('../models/entries');
const utils = require('../utils');

const create = async (req, res, next) => {
    const recordDoc = req.record_doc;
    let data = req.body;
    try {
        await recordDoc.populate('fields');
        const schemaStruct = utils.recordFieldsToEntrySchema(recordDoc.fields);
        const schema = new Schema(schemaStruct);
        data = utils.cleanObj(data, Object.keys(schemaStruct));

        await entries.validateByEntrySchema(schema, data);

        const entryDoc = entries.EntrySchema(data, false);
        entryDoc._record = recordDoc._id;

        await entryDoc.save();
        
        return res.json(entryDoc);
    } catch (error) {
        return next(error);
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
    try {
        const entryDocExists = await entries.EntrySchema.exists({_id: entry_id, _record: recordDoc._id});
        if(!entryDocExists)
            return res.status(404).end();

        await recordDoc.populate('fields');
        const schemaStruct = utils.recordFieldsToEntrySchema(recordDoc.fields);
        const schema = new Schema(schemaStruct);
        const fieldKeys = Object.keys(schemaStruct);
        
        data = utils.cleanObj(data, fieldKeys);
        await entries.validateByEntrySchema(schema, data, fieldKeys);
        
        const entryDoc = await entries.EntrySchema.findOneAndUpdate({_id: entry_id, _record: recordDoc._id}, data, {lean: true, strict: false, new: true})
        
        return res.json(entryDoc).end();
    } catch (error) {
        return next(error);
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