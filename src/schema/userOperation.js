const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const UserOperation = new Schema(
  {
    userOperations: [
      { type: mongoose.SchemaTypes.ObjectId, ref: "operationUser" },
    ],
    totalBalance: {
      type: Number,
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
