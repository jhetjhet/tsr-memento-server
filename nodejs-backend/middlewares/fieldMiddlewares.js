const { body } = require('express-validator');
const fieldsModel = require('../models/fields');
const middlewares = require('./');

const create = [
    body().isObject(),
    body('field_type').notEmpty().withMessage('This field is required').isIn(fieldsModel.FIELD_MODELS).withMessage(`Invalid 'field_type' must be one of the ff:[${fieldsModel.FIELD_MODELS}]`),
    middlewares.validationError,
    async (req, res, next) => {
        const data = req.body;
        const record = req.recform_doc;
        try {
            const field = fieldsModel[data.field_type](data);
            await field.validate();

            await field.save({ validateBeforeSave: false });
            record.fields.push(field._id);
            await record.save();
            return res.json(field);
        } catch (error) {
            return next(error);
        }
    },
];

const update = async (req, res, next) => {
    const { field_id } = req.params;
    const record = req.recform_doc;
    const data = req.body;

    try {
        if(!(record.fields.indexOf(field_id) > -1)) // check if field_id exists in record fields
            return res.status(404).end();

        const field = await fieldsModel.FieldSchema.findById(field_id);
        Object.assign(field, data);
        await field.save();

        return res.json(field);
    } catch (error) {
        return next(error);
    }
}

const lists = async (req, res, next) => {
    const record = req.recform_doc;
    try {
        await record.populate('fields');
        return res.json(record.fields);
    } catch (error) {
        return next(error);
    }
};

const retrieve = async (req, res, next) => {
    const { field_id } = req.params;

    try {
        const field = await fieldsModel.FieldSchema.findById(field_id);
        if(!field)
            return res.status(404).end();
        
        return res.json(field);
    } catch (error) {
        return next(error);
    }
}

const _delete = async (req, res, next) => {
    const { field_id } = req.params;

    try {
        const result = await fieldsModel.FieldSchema.deleteOne({_id: field_id});
        if(result.deletedCount == 0)
            return res.status(404).end();
        
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