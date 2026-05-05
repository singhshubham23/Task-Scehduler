const { body } = require('express-validator');

const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 2 })
    .withMessage('Project name must be at least 2 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required'),
];

const addMemberValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Member email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
];

module.exports = { createProjectValidator, addMemberValidator };
