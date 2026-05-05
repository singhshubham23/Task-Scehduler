const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats,
  getTeamMembers,
} = require('../controllers/taskController');
const {
  createTaskValidator,
  updateStatusValidator,
  taskIdParamValidator,
  projectIdParamValidator,
} = require('../validators/taskValidator');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/role');

// All routes require authentication
router.use(verifyToken);

// @route   GET /api/tasks/stats/dashboard
// Must be defined BEFORE /:projectId to avoid route conflict
router.get('/stats/dashboard', getDashboardStats);

// @route   GET /api/tasks/stats/team
router.get('/stats/team', getTeamMembers);

// @route   GET /api/tasks/single/:id
// Must be defined BEFORE /:projectId to avoid route conflict
router.get('/single/:id', taskIdParamValidator, getTask);

// @route   POST /api/tasks/:projectId
router.post(
  '/:projectId',
  checkRole('admin'),
  projectIdParamValidator,
  createTaskValidator,
  createTask
);

// @route   GET /api/tasks/:projectId
router.get('/:projectId', projectIdParamValidator, getTasks);

// @route   PUT /api/tasks/:id
router.put('/:id', checkRole('admin'), taskIdParamValidator, createTaskValidator, updateTask);

// @route   PATCH /api/tasks/:id/status
router.patch('/:id/status', taskIdParamValidator, updateStatusValidator, updateTaskStatus);

// @route   DELETE /api/tasks/:id
router.delete('/:id', checkRole('admin'), taskIdParamValidator, deleteTask);

module.exports = router;
