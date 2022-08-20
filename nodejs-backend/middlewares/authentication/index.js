const { body } = require('express-validator');
const User = require('../../models/user');
const Token = require('../../models/token');
const jwt = require('jsonwebtoken');
const middlewares = require('../');

const AUTHORIZATION_PATTER = '^Bearer\\s(?<token>[^\\s]+)$'

const requireAuthorizationHeader = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let authMatch = new RegExp(AUTHORIZATION_PATTER, 'g').exec(authHeader);

    if(!authMatch)
        return res.status(401).end();
    
    req.auth_token = authMatch.groups.token;
    next();
}

const authenticateMiddleware = [
    requireAuthorizationHeader,
    (req, res, next) => {
        jwt.verify(req.auth_token, process.env.SECRET_ACCESS_TOKEN, async (err, payload) => {
            if(err)
                return next(err);
    
            try {
                let user = await User.findByUsername(payload.username);
                req.user = user;
            } catch (error) {
                return next(error);
            }

            next();
        });
    }
];

const register = [
    body('username').custom(async (value, { req }) => {

        if(!value)
            throw new Error('This field is required');
        
        let user = await User.findByUsername(value);

        if(user)
            throw new Error('User with this username already exists.');

        return true;
    }),
    body('password').notEmpty().withMessage('This field is required.').isLength({ min: 6 }).withMessage('The password must be at least 6 character long.'),
    body('re_password').custom((value, { req }) => {

        if(!value)
            throw new Error('This field is required');

        if(value !== req.body.password)
            throw new Error('Password confirmation does not match password');

        return true;
    }),
    middlewares.validationError,
    async (req, res, next) => {
        try {
            const user = new User(req.body);
            await user.save();
            return res.end();
        } catch (error) {
            return next(error);
        }
    },
];

const login = [
    body('username').notEmpty().withMessage('This field is required.'),
    body('password').notEmpty().withMessage('This field is required.'),
    middlewares.validationError,
    async (req, res, next) => {

        try {
            let user = await User.findByUsername(req.body.username);

            if(!user)
                return res.status(401).json({
                    message: "Invalid username or password",
                });
            
            let isValid = await user.validatePass(req.body.password);
            
            if(!isValid)
                return res.status(401).json({
                    message: "Invalid username or password",
                });

            let accessToken = User.createAccessToken(user.createPayload());
            let refreshToken = User.createRefreshToken(user.createPayload());
            const token = new Token({
                token: refreshToken,
                user_id: user._id,
            });
            await token.save();
            res.json({accessToken, refreshToken});
        } catch (error) {
            return next(error);
        }
    },
];

const refresh = [
    body('token').notEmpty(),
    middlewares.validationError,
    (req, res, next) => {
        let refreshToken = req.body.token;

        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, async (err, payload) => {
            if(err)
                return next(err);
            
            if(!payload.username)
                return res.status(401).end();
            
            let user = await User.findByUsername(payload.username);

            if(!user)
                return res.status(401).end()            
            
            let refToken = await Token.findOne({ token: refreshToken });

            // check if refresh token exists (it will get removed if user logged out)
            if(!refToken)
                return res.status(401).end();

            let accessToken = User.createAccessToken(user.createPayload());

            return res.json({
                accessToken,
            });
        });
    },
];

const logout = [
    authenticateMiddleware,
    async (req, res, next) => {
        let user = req.user;

        try {
            await Token.deleteOne({ user_id: user._id });

            return res.end();
        } catch (error) {
            return next(error);
        }
    },
];

const verify = [
    body('token').notEmpty().withMessage('This field is required'),
    middlewares.validationError,
    (req, res, next) => {

        jwt.verify(req.body.token, process.env.SECRET_ACCESS_TOKEN, (err, payload) => {
            if(err)
                return next(err);
            
            return res.status(200).end();
        });
        
    },
];

const retrieve = [
    authenticateMiddleware,
    (req, res) => {
        return res.json(req.user.getCleanData());
    },
];

module.exports = {
    authenticateMiddleware,
    register,
    login,
    logout,
    refresh,
    verify,
    retrieve,
}