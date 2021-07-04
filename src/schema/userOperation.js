const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;
const OperationsSchema = require("./operations");

const UserOperation = new Schema(
  {
    userOperations: [OperationsSchema],
    totalBalance: {
      type: Number,
    },
    typeTotalBalance: {
      type: String,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

UserOperation.plugin(mongoosePaginate);

const UserFinance = mongoose.model("operations", UserOperation);

module.exports = UserFinance;
