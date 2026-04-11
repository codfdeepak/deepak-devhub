const mongoose = require('mongoose')

const stringArrayLimit = (value, max) => Array.isArray(value) && value.length <= max

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    bulletPoints: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return stringArrayLimit(arr, 40)
        },
        message: 'Bullet points can hold up to 40 items',
      },
    },
    snapshots: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return stringArrayLimit(arr, 15)
        },
        message: 'Snapshots can hold up to 15 images',
      },
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Service', serviceSchema)
