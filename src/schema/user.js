const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const SALT_FACTOR = 6;
const { Subscription } = require("../helpers/constants");

const usersSchema = new Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 24,
      default: "Guest",
    },
    subscription: {
      type: String,
      enum: {
        values: [
          Subscription.STARTER,
          Subscription.PRO,
          Subscription.BUSINESS,
          Subscription.NONE,
        ],
      },
      default: Subscription.NONE,
      message: "This Subscription is not allowed",
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: function () {
        return null;
      },
    },
    avatarId: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(
    this.password,
    bcrypt.genSaltSync(SALT_FACTOR)
  );
  next();
});

usersSchema.path("email").validate(function (value) {
  const regExt =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regExt.test(String(value).toLowerCase());
});

usersSchema.path("password").validate(function (value) {
  const regExt = /^[a-zA-Z0-9]{7,30}$/;
  return regExt.test(String(value));
});

usersSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", usersSchema);

module.exports = User;
