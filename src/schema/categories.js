const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    value: { type: String },
    color: { type: String },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const CategoriesShema = mongoose.model("categoryUser", CategorySchema);

module.exports = CategoriesShema;
