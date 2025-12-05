const { Schema, model } = require('mongoose');

const profileSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    lastCompletedAt: Date,
    completedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model('Profile', profileSchema);

