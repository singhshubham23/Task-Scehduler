const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Admin only
 */
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id], // Admin is also a member
    });

    await project.populate('admin', 'name email');
    await project.populate('members', 'name email');

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all projects for the logged-in user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { admin: req.user.id },
        { members: req.user.id },
      ],
    })
      .populate('admin', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member or admin of this project
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user.id
    );
    const isAdmin = project.admin._id.toString() === req.user.id;

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Admin only
 */
const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only the admin who created the project can update it
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project admin can update this project' });
    }

    const { name, description } = req.body;
    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();
    await project.populate('admin', 'name email');
    await project.populate('members', 'name email');

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a project and its tasks
 * @route   DELETE /api/projects/:id
 * @access  Admin only
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project admin can delete this project' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project and associated tasks deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add a member to a project by email
 * @route   PUT /api/projects/:id/members
 * @access  Admin only
 */
const addMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project admin can add members' });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Check if already a member
    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    project.members.push(user._id);
    await project.save();
    await project.populate('admin', 'name email');
    await project.populate('members', 'name email');

    res.json(project);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
};
