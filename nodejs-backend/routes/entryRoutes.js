const express = require('express');
const router = express.Router();
const entryMiddlewares = require('../middlewares/entryMiddlewares');

router.post('/entries/', entryMiddlewares.create);
router.get('/entries/', entryMiddlewares.lists);
router.get('/entries/:entry_id/', entryMiddlewares.retrieve);
router.put('/entries/:entry_id/', entryMiddlewares.update);
router.patch('/entries/:entry_id/', entryMiddlewares.update);
router.delete('/entries/:entry_id/', entryMiddlewares.delete);

module.exports = router;