const express = require('express');
const router = express.Router();
const recordFormatMiddlewares = require('../middlewares/recordFormatMiddlewares');

const fieldRoutes = require('./fieldRoutes');
const recordRoutes = require('./recordRoutes');

router.post('/schemas/', recordFormatMiddlewares.create);
router.get('/schemas/', recordFormatMiddlewares.lists);
router.get('/schemas/:schema_id/', recordFormatMiddlewares.retrieve);
router.put('/schemas/:schema_id/', recordFormatMiddlewares.update);
router.patch('/schemas/:schema_id/', recordFormatMiddlewares.update);
router.delete('/schemas/:schema_id/', recordFormatMiddlewares.delete);

router.use('/schemas/:schema_id/', recordFormatMiddlewares.recordFormatDocument, fieldRoutes);
router.use('/schemas/:schema_id/', recordFormatMiddlewares.recordFormatDocument, recordRoutes);

module.exports = router;