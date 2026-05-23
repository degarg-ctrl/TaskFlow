const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    note: {
      type: String,
      trim: true
    },
    priority: {
      type: String,
      required: [true, 'Task priority is required'],
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority'
      },
      default: 'low'
    },
    dueDate: {
      type: Date
    },
    status: {
      type: String,
      required: [true, 'Task status is required'],
      enum: {
        values: ['active', 'done'],
        message: '{VALUE} is not a valid status'
      },
      default: 'active'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
