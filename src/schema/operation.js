const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const operationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      min: 2,
      max: 24,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
    },
    phone: {
      type: String,
      min: 14,
      max: 14,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

operationSchema.plugin(mongoosePaginate);

const Operation = mongoose.model("operation", operationSchema);

module.exports = Operation;
