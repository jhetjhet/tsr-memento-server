const { Schema } = require('mongoose');
const record = require('../models/record');
const utils = require('../utils');

const create = async (req, res, next) => {
    const recFormDoc = req.recform_doc;
    let data = req.body;
    try {
        await recFormDoc.populate('fields');
        const schemaStruct = utils.recordFormatFieldsToSchemaStructure(recFormDoc.fields);
        const schema = new Schema(schemaStruct);
        data = utils.cleanObj(data, Object.keys(schemaStruct));

        await record.validateByRecordSchema(schema, data);

        const recDoc = record.RecordSchema(data, false);
        recDoc._schema = recFormDoc._id;

        await recDoc.save();
        
        return res.json(recDoc);
    } catch (error) {
        return next(error);
    }
}

const lists = async (req, res, next) => {
    const recFormDoc = req.recform_doc;
    try {
        const records = await record.RecordSchema.find({_schema: recFormDoc._id}).lean();
        return res.json(records);
    } catch (error) {
        return next(error);
    }
}

const retrieve = async (req, res, next) => {
    const { record_id } = req.params;
    const recFormDoc = req.recform_doc;
    try {
        const recDoc = await record.RecordSchema.findOne({_id: record_id, _schema: recFormDoc._id}).lean();
        if(!recDoc)
            return res.status(404).end();
        return res.json(recDoc);
    } catch (error) {
        return next(error);
    }
}

const update = async (req, res, next) => {
    const { record_id } = req.params;
    const recFormDoc = req.recform_doc;
    let data = req.body;
    try {
        const recDocExists = await record.RecordSchema.exists({_id: record_id, _schema: recFormDoc._id});
        if(!recDocExists)
            return res.status(404).end();

        await recFormDoc.populate('fields');
        const schemaStruct = utils.recordFormatFieldsToSchemaStructure(recFormDoc.fields);
        const schema = new Schema(schemaStruct);
        data = utils.cleanObj(data, Object.keys(schemaStruct));

        await record.validateByRecordSchema(schema, data, Object.keys(data));
        
        const recDoc = await record.RecordSchema.findOneAndUpdate({_id: record_id, _schema: recFormDoc._id}, data, {lean: true, strict: false, new: true})
        
        return res.json(recDoc).end();
    } catch (error) {
        console.log(error)
        return next(error);
    }
}

const _delete = async (req, res, next) => {
    const { record_id } = req.params;
    const recFormDoc = req.recform_doc;
    try {
        const delRes = await record.RecordSchema.deleteOne({_id: record_id, _schema: recFormDoc._id});
        console.log(delRes)
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