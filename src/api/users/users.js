const express = require("express");
const router = express.Router();
const usersControllers = require("../../controllers/users");
const guard = require("../../helpers/guard");
const {
  createAccountLimiter,
  loginLimiter,
} = require("../../helpers/rate-limit");
const { validateUpdateSubscriptionStatus } = require("../../validator/users");

const upload = require("../../helpers/multer");

router
  .post("/registration", createAccountLimiter, usersControllers.reg)
  .post("/login", usersControllers.login)
  .post("/logout", guard, usersControllers.logout)
  .get("/current", guard, usersControllers.currentUser)
  .post(
    "/",
    guard,
    validateUpdateSubscriptionStatus,
    usersControllers.updateSubscriptionStatus
  )
  .patch("/avatars", guard, upload.single("avatar"), usersControllers.avatars)
  .get("/verify/:token", usersControllers.verify)
  .post("/verify", usersControllers.verifyRepeatedly);

module.exports = router;
