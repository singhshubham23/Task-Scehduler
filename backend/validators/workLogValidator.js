const { body, param } = require('express-validator');

const projectIdParamValidator = [
  param('projectId')
    .isMongoId()
    .withMessage('Project ID must be a valid MongoDB ObjectId'),
];

const createWorkLogValidator = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be at most 1000 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
];

module.exports = {
  projectIdParamValidator,
  createWorkLogValidator,
};
