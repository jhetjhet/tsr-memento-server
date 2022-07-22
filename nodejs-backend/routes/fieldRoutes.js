const express = require('express');
const router = express.Router();
const fieldMiddlewares = require('../middlewares/fieldMiddlewares');

router.post('/fields/', fieldMiddlewares.create);
router.get('/fields/', fieldMiddlewares.lists);
router.get('/fields/:field_id/', fieldMiddlewares.retrieve);
router.put('/fields/:field_id/', fieldMiddlewares.update);
router.patch('/fields/:field_id/', fieldMiddlewares.update);
router.delete('/fields/:field_id/', fieldMiddlewares.delete);

module.exports = router;