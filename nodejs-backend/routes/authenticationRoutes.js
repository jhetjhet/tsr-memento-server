const express = require('express');
const router = express.Router();
const authenticationMiddlewares = require('../middlewares/authentication');

router.post('/auth/register/', authenticationMiddlewares.register);
router.post('/auth/login/', authenticationMiddlewares.login);
router.post('/auth/logout/', authenticationMiddlewares.logout);
router.post('/auth/refresh/', authenticationMiddlewares.refresh);
router.post('/auth/verify/', authenticationMiddlewares.verify);
router.get('/auth/user/', authenticationMiddlewares.retrieve);

module.exports = router;