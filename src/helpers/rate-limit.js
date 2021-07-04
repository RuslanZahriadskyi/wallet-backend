const rateLimit = require("express-rate-limit");
const { HttpCode } = require("./constants");
const { createUserLimit } = require("../config/rate-limit.json");

const createAccountLimiter = rateLimit({
  windowMs: createUserLimit.windowMs, // time - createUserLimit.windowMs window
  max: createUserLimit.max, // start blocking after createUserLimit.max requests
  handler: (_req, res) => {
    res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message:
        "Too many accounts created from this IP, please try again after an hour",
    });
  },
});

// const loginLimiter = rateLimit({
//   windowMs: createUserLimit.windowMs, // time - createUserLimit.windowMs window
//   max: createUserLimit.max, // start blocking after createUserLimit.max requests
//   handler: (_req, res) => {
//     res.status(HttpCode.BAD_REQUEST).json({
//       status: "error",
//       code: HttpCode.BAD_REQUEST,
//       message:
//         "Too many login requests from this IP, please try again after 5 minutes",
//     });
//   },
// });

module.exports = { createAccountLimiter };
