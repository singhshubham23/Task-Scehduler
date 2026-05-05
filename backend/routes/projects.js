const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
} = require('../controllers/projectController');
const { createProjectValidator, addMemberValidator } = require('../validators/projectValidator');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');

// All routes require authentication
router.use(verifyToken);

// @route   POST /api/projects
router.post('/', checkRole('admin'), createProjectValidator, createProject);

// @route   GET /api/projects
router.get('/', getProjects);

// @route   GET /api/projects/:id
router.get('/:id', getProject);

// @route   PUT /api/projects/:id
router.put('/:id', checkRole('admin'), createProjectValidator, updateProject);

// @route   DELETE /api/projects/:id
router.delete('/:id', checkRole('admin'), deleteProject);

// @route   PUT /api/projects/:id/members
router.put('/:id/members', checkRole('admin'), addMemberValidator, addMember);

module.exports = router;
