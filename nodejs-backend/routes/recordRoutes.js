const express = require('express');
const router = express.Router();
const recordMiddlewares = require('../middlewares/recordMiddlewares');

const fieldRoutes = require('./fieldRoutes');

router.post('/records/', recordMiddlewares.create);
router.get('/records/', recordMiddlewares.lists);
router.get('/records/:record_id/', recordMiddlewares.retrieve);
router.put('/records/:record_id/', recordMiddlewares.update);
router.patch('/records/:record_id/', recordMiddlewares.update);
router.delete('/records/:record_id/', recordMiddlewares.delete);
router.use('/records/:record_id/', recordMiddlewares.recordDocument, fieldRoutes);

module.exports = router;