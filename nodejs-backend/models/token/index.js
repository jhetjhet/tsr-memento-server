const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
});

// before storing a token make sure that tokens with the same user (user_id)
// is cleaned or deleted so that it will become invalid or unusable
tokenSchema.pre('save', function(next) {

    let TokenModel = mongoose.model('Token');

    TokenModel.deleteMany({ user_id: this.user_id }).exec(() => {
        next();
    });
});

const Token = new mongoose.model('Token', tokenSchema);

module.exports = Token;