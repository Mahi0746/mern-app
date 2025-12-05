const { Schema, model } = require('mongoose');

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: Date,
    pointsEarned: {
      type: Number,
      default: 10,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: 'demo-user',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Todo', todoSchema);

