const { Schema, model } = require('mongoose');

const badgeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    icon: String,
    criteria: {
      type: String,
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Badge', badgeSchema);

