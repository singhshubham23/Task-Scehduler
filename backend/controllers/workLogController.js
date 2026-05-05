const { validationResult } = require('express-validator');
const WorkLog = require('../models/WorkLog');
const Project = require('../models/Project');

/**
 * @desc    Create a new work log for a project
 * @route   POST /api/worklogs/:projectId
 * @access  Private (Project members and admin)
 */
const createLog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { description, date } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify user is a member or admin
    const isMember = project.members.some((m) => m.toString() === req.user.id);
    const isAdmin = project.admin.toString() === req.user.id;

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Only members of the project can log work' });
    }

    const workLog = await WorkLog.create({
      project: projectId,
      user: req.user.id,
      description,
      date: date || Date.now(),
    });

    await workLog.populate('user', 'name email');

    res.status(201).json(workLog);
  } catch (error) {
    console.error('Create work log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all work logs for a project
 * @route   GET /api/worklogs/:projectId
 * @access  Private (Admin only)
 */
const getLogs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify user is the project admin
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project admin can view team work logs' });
    }

    const logs = await WorkLog.find({ project: projectId })
      .populate('user', 'name email')
      .sort({ date: -1, createdAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error('Get work logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createLog,
  getLogs,
};
