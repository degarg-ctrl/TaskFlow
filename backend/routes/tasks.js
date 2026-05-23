const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authGuard = require('../middleware/authGuard');

// Apply authGuard middleware to all routes in this router
router.use(authGuard);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      data: tasks,
      error: null
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({
      data: null,
      error: 'Internal server error.'
    });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task for the authenticated user
 * @access  Private
 */
router.post('/', async (req, res) => {
  const { title, note, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({
      data: null,
      error: 'Task title is required.'
    });
  }

  try {
    const newTask = new Task({
      title,
      note,
      priority: priority || 'low',
      dueDate: dueDate || undefined,
      userId: req.userId
    });

    const savedTask = await newTask.save();
    return res.status(201).json({
      data: savedTask,
      error: null
    });
  } catch (error) {
    console.error('Error creating task:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        data: null,
        error: messages.join(', ')
      });
    }
    return res.status(500).json({
      data: null,
      error: 'Internal server error.'
    });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task (belongs to the authenticated user)
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  const { title, note, priority, dueDate, status } = req.body;

  try {
    // Find the task by ID
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        data: null,
        error: 'Task not found.'
      });
    }

    // Check ownership
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({
        data: null,
        error: 'Not authorized to update this task.'
      });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (note !== undefined) task.note = note;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    return res.status(200).json({
      data: updatedTask,
      error: null
    });
  } catch (error) {
    console.error('Error updating task:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        data: null,
        error: messages.join(', ')
      });
    }
    return res.status(500).json({
      data: null,
      error: 'Internal server error.'
    });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task (belongs to the authenticated user)
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        data: null,
        error: 'Task not found.'
      });
    }

    // Check ownership
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({
        data: null,
        error: 'Not authorized to delete this task.'
      });
    }

    await Task.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      data: { id: req.params.id, message: 'Task deleted successfully.' },
      error: null
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      data: null,
      error: 'Internal server error.'
    });
  }
});

module.exports = router;
