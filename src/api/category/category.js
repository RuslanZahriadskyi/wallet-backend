const { Router } = require("express");
const express = require("express");
const router = express.Router();
const categoryControllers = require("../../controllers/category");

const guard = require("../../helpers/guard");

router
  .get("/", guard, categoryControllers.getAllCategory)
  .post("/", guard, categoryControllers.createCategory)
  .delete("/", guard, categoryControllers.deleteCategory);

module.exports = router;
