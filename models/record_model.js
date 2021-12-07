const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    counts: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
  
);

/**
 * @typedef Record
 */
const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
