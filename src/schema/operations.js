const { Schema } = require("mongoose");

const OperationsSchema = new Schema(
  {
    date: {
      type: String,
    },
    category: {
      type: String,
    },
    comments: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
    },
    type: {
      type: String,
    },
    balanceAfter: {
      type: Number,
    },
    typeBalanceAfter: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = OperationsSchema;
