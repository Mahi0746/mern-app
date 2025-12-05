const { Schema, model } = require('mongoose');

const userBadgeSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    badgeId: {
      type: Schema.Types.ObjectId,
      ref: 'Badge',
      required: true,
    },
    awardedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

module.exports = model('UserBadge', userBadgeSchema);

