const { body, param } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Completed'])
    .withMessage('Status must be Todo, In Progress, or Completed'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('assignedTo must be a valid user ID'),
];

const updateStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Todo', 'In Progress', 'Completed'])
    .withMessage('Status must be Todo, In Progress, or Completed'),
];

const taskIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Task ID must be a valid MongoDB ObjectId'),
];

const projectIdParamValidator = [
  param('projectId')
    .isMongoId()
    .withMessage('Project ID must be a valid MongoDB ObjectId'),
];

module.exports = {
  createTaskValidator,
  updateStatusValidator,
  taskIdParamValidator,
  projectIdParamValidator,
};
