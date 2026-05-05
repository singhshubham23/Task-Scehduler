const express = require('express');
const router = express.Router();
const { createLog, getLogs } = require('../controllers/workLogController');
const verifyToken = require('../middleware/auth');
const {
  projectIdParamValidator,
  createWorkLogValidator,
} = require('../validators/workLogValidator');

router.post('/:projectId', verifyToken, projectIdParamValidator, createWorkLogValidator, createLog);
router.get('/:projectId', verifyToken, projectIdParamValidator, getLogs);

module.exports = router;
