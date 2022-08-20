const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    },
    password: {
        type: String,
        required: true,
    }
});

userSchema.pre('save', async function(next) {
    let user = this;

    if(!user.isModified('password'))
        return next();

    const hashedPass = await bcrypt.hash(user.password, 10);
    
    user.password = hashedPass;

    next();
});

userSchema.methods.validatePass = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.createPayload = function(addData={}) {
    return {
        id: this._id,
        username: this.username,
        ...addData,
    }
}

userSchema.static('createAccessToken', function(payload) {
    return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });
});

userSchema.static('createRefreshToken', function(payload) {
    return jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN, {
        expiresIn: process.env.REFRESH_TOKEN_LIFE,
    });
});

userSchema.static('findByUsername', function(username) {
    return this.findOne({username});
});

const User = mongoose.model('User', userSchema);

module.exports = User;