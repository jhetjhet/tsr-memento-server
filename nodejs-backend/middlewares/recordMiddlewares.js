const RecordSchema = require('../models/record');

const recordDocument = async (req, res, next) => {
    const { record_id } = req.params;
    try {
        const record = await RecordSchema.findById(record_id);
        if(record){
            req.record_doc = record;
            return next();
        }

        return res.status(404).end();
    } catch (error) {
        return next(error);
    }
}

const create = async (req, res, next) => {
    try {
        let user = req.user;
        let recData = req.body;
        // override 'to' field and set to logged in user
        recData.to = user._id;
        const record = RecordSchema(recData);
        await record.save();
        return res.json(record);
    } catch (error) {
        return next(error);
    }
}

const lists = async (req, res, next) => {
    try {
        let user = req.user;
        const records = await RecordSchema.find({
            to: user._id,
        }).lean();
        return res.json(records);
    } catch (error) {
        return next(error);
    }
}

const retrieve = [
    recordDocument,
    (req, res) => {
        res.json(req.record_doc);
    },
];

const update = [
    recordDocument,
    async (req, res, next) => {
        const record = req.record_doc;
        try {
            Object.assign(record, req.body);
            await record.save();
            return res.json(record);
        } catch (error) {
            return next(error);
        }
    }
]

const _delete = [
    recordDocument,
    async (req, res, next) => {
        const record = req.record_doc;
        try {
            await record.remove();
            return res.status(201).end();
        } catch (error) {
            return next(error);
        }
    }
]

module.exports = {
    recordDocument,
    create,
    lists,
    retrieve,
    update,
    delete: _delete,
};