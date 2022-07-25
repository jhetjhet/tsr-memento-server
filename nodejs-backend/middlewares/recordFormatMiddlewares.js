const RecordFormatSchema = require('../models/record/recordFormatSchema');

const recordFormatDocument = async (req, res, next) => {
    const { schema_id } = req.params;
    try {
        const record = await RecordFormatSchema.findById(schema_id);
        if(record){
            req.recform_doc = record;
            return next();
        }

        return res.status(404).end();
    } catch (error) {
        return next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const record = RecordFormatSchema(req.body);
        await record.save();
        return res.json(record);
    } catch (error) {
        return next(error);
    }
}

const lists = async (req, res, next) => {
    try {
        const records = await RecordFormatSchema.find();
        return res.json(records);
    } catch (error) {
        return next(error);
    }
}

const retrieve = [
    recordFormatDocument,
    (req, res) => {
        res.json(req.recform_doc);
    },
];

const update = [
    recordFormatDocument,
    async (req, res, next) => {
        const record = req.recform_doc;
        try {
            Object.assign(record, req.body);
            await RecordFormatSchema.save();
            return res.json(record);
        } catch (error) {
            return next(error);
        }
    }
]

const _delete = async (req, res, next) => {
    const { schema_id } = req.params;
    try {
        await RecordFormatSchema.deleteOne({_id: schema_id});
        return res.status(201).end();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    recordFormatDocument,
    create,
    lists,
    retrieve,
    update,
    delete: _delete,
};