const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const leaveSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    daysCount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['APPROVED', 'DENIED', 'PENDING', 'CANCELLED'],
      default: 'PENDING',
    },
    // type: {
    //   type: String,
    //   required: false,
    // },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
leaveSchema.plugin(toJSON);
leaveSchema.plugin(paginate);

/**
 * @typedef Leavee
 */
const Leavee = mongoose.model('Leavee', leaveSchema);

module.exports = Leavee;
