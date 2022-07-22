const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const validationError = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const errs = errors.mapped();
        Object.keys(errs).forEach((k) => {
            errs[k].message = errs[k].msg;
            delete errs[k].msg;
        });
        return res.status(400).json(errs);
    }
    next();
}

const errorHandler = (err, req, res, next) => {

    if(err instanceof mongoose.Error.ValidationError)
        return res.status(400).json(err.errors);

    next();
}

module.exports = {
    validationError,
    errorHandler,
}
