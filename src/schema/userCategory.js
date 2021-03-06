const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const UserCategory = new Schema(
  {
    category: [{ type: mongoose.SchemaTypes.ObjectId, ref: "categoryUser" }],
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  }
);

UserCategory.plugin(mongoosePaginate);

const UserCategories = mongoose.model("categories", UserCategory);

module.exports = UserCategories;
