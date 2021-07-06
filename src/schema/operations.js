const mongoose = require("mongoose");
const { Schema } = mongoose;

const OperationSchema = new Schema(
  {
    date: {
      type: Number,
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
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const OperationsSchema = mongoose.model("operationUser", OperationSchema);

module.exports = OperationsSchema;