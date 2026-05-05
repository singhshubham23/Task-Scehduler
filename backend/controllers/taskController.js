const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const WorkLog = require('../models/WorkLog');
const User = require('../models/User');

/**
 * @desc    Create a task in a project
 * @route   POST /api/tasks/:projectId
 * @access  Admin only
 */
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;

    // Verify project exists and user is the admin
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project admin can create tasks' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // If assignedTo is provided, verify the user is a member of the project
    if (assignedTo) {
      const isMember = project.members.some(
        (m) => m.toString() === assignedTo
      );
      if (!isMember) {
        return res.status(400).json({ message: 'Assigned user is not a member of this project' });
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      project: projectId,
    });

    await task.populate('assignedTo', 'name email');

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all tasks for a project
 * @route   GET /api/tasks/:projectId
 * @access  Private
 */
const getTasks = async (req, res) => {
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

    // Check if user is a member or admin
    const isMember = project.members.some(
      (m) => m.toString() === req.user.id
    );
    const isAdmin = project.admin.toString() === req.user.id;

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single task
 * @route   GET /api/tasks/single/:id
 * @access  Private
 */
const getTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name admin members');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify user is a member or admin of the task's project
    const isMember = task.project.members.some((m) => m.toString() === req.user.id);
    const isAdmin = task.project.admin.toString() === req.user.id;
    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a task (Admin only - full update)
 * @route   PUT /api/tasks/:id
 * @access  Admin only
 */
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify user is the project admin
    const project = await Project.findById(task.project);
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project admin can fully update tasks' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // If assignedTo is provided, ensure that user belongs to the project
    if (assignedTo !== undefined && assignedTo !== null && assignedTo !== '') {
      const isMember = project.members.some((m) => m.toString() === assignedTo);
      if (!isMember) {
        return res.status(400).json({ message: 'Assigned user is not a member of this project' });
      }
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;

    await task.save();
    await task.populate('assignedTo', 'name email');

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update task status only (Members & Admins)
 * @route   PATCH /api/tasks/:id/status
 * @access  Private (any authenticated member of the project)
 */
const updateTaskStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify user is a member or admin of the project
    const project = await Project.findById(task.project);
    const isMember = project.members.some(
      (m) => m.toString() === req.user.id
    );
    const isAdmin = project.admin.toString() === req.user.id;

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Rule: Only admin can mark a task as Completed
    if (req.body.status === 'Completed' && !isAdmin) {
      return res.status(403).json({ message: 'Only the project admin can mark tasks as completed after review' });
    }

    task.status = req.body.status;
    await task.save();
    await task.populate('assignedTo', 'name email');

    res.json(task);
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Admin only
 */
const deleteTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify user is the project admin
    const project = await Project.findById(task.project);
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project admin can delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get dashboard stats for the logged-in user (role-aware)
 * @route   GET /api/tasks/stats/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get all projects the user is part of
    const projects = await Project.find({
      $or: [
        { admin: userId },
        { members: userId },
      ],
    }).populate('members', 'name email');

    const projectIds = projects.map((p) => p._id);

    // Get all tasks for those projects
    const allTasks = await Task.find({ project: { $in: projectIds } })
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    const now = new Date();

    if (userRole === 'admin') {
      // ========= ADMIN DASHBOARD =========
      // Collect unique member IDs across all admin's projects
      const memberSet = new Set();
      projects.forEach((p) => {
        p.members.forEach((m) => {
          if (m._id.toString() !== userId) memberSet.add(m._id.toString());
        });
      });

      const stats = {
        totalTasks: allTasks.length,
        totalProjects: projects.length,
        totalMembers: memberSet.size,
        todo: allTasks.filter((t) => t.status === 'Todo').length,
        inProgress: allTasks.filter((t) => t.status === 'In Progress').length,
        completed: allTasks.filter((t) => t.status === 'Completed').length,
        overdue: allTasks.filter(
          (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed'
        ).length,
      };

      // Recent tasks (last 15)
      const recentTasks = allTasks.slice(0, 15);

      // Recent work logs across all admin's projects
      let recentLogs = [];
      try {
        recentLogs = await WorkLog.find({ project: { $in: projectIds } })
          .populate('user', 'name email')
          .populate('project', 'name')
          .sort({ date: -1, createdAt: -1 })
          .limit(10);
      } catch (e) {
        // WorkLog might not exist yet, fail gracefully
      }

      return res.json({
        role: 'admin',
        stats,
        recentTasks,
        recentLogs,
      });
    } else {
      // ========= MEMBER DASHBOARD =========
      const myTasks = allTasks.filter(
        (t) => t.assignedTo?._id?.toString() === userId
      );

      const stats = {
        totalAssigned: myTasks.length,
        totalProjects: projects.length,
        todo: myTasks.filter((t) => t.status === 'Todo').length,
        inProgress: myTasks.filter((t) => t.status === 'In Progress').length,
        completed: myTasks.filter((t) => t.status === 'Completed').length,
        overdue: myTasks.filter(
          (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Completed'
        ).length,
      };

      // Group tasks by status for the member
      const todoTasks = myTasks.filter((t) => t.status === 'Todo');
      const inProgressTasks = myTasks.filter((t) => t.status === 'In Progress');
      const completedTasks = myTasks.filter((t) => t.status === 'Completed');

      return res.json({
        role: 'member',
        stats,
        todoTasks,
        inProgressTasks,
        completedTasks,
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all unique team members across admin's projects
 * @route   GET /api/tasks/stats/team
 * @access  Admin only
 */
const getTeamMembers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }

    // Get all projects where this user is admin
    const projects = await Project.find({ admin: req.user.id })
      .populate('members', 'name email role');

    // Collect unique members
    const memberMap = new Map();
    projects.forEach((p) => {
      p.members.forEach((m) => {
        if (m._id.toString() !== req.user.id) {
          if (!memberMap.has(m._id.toString())) {
            memberMap.set(m._id.toString(), {
              _id: m._id,
              name: m.name,
              email: m.email,
              role: m.role,
              projects: [],
              taskCounts: { todo: 0, inProgress: 0, completed: 0 },
            });
          }
          memberMap.get(m._id.toString()).projects.push({
            _id: p._id,
            name: p.name,
          });
        }
      });
    });

    // Get task counts for each member
    const projectIds = projects.map((p) => p._id);
    const allTasks = await Task.find({ project: { $in: projectIds } });

    allTasks.forEach((t) => {
      if (t.assignedTo && memberMap.has(t.assignedTo.toString())) {
        const member = memberMap.get(t.assignedTo.toString());
        if (t.status === 'Todo') member.taskCounts.todo++;
        else if (t.status === 'In Progress') member.taskCounts.inProgress++;
        else if (t.status === 'Completed') member.taskCounts.completed++;
      }
    });

    res.json(Array.from(memberMap.values()));
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats,
  getTeamMembers,
};
