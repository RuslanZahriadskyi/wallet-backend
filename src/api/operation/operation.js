const express = require("express");
const router = express.Router();
const operationControllers = require("../../controllers/operation");

const guard = require("../../helpers/guard");

router
  .get("/", guard, operationControllers.getAllFinance)
  .get("/statistics/:month/:year", guard, operationControllers.getStatistic)
  .post("/", guard, operationControllers.createOperation)
  .patch("/:operationId", guard, operationControllers.changeOperation)
  .delete("/:operationId", guard, operationControllers.deleteOperation);

// router
//   .get("/:contactId", guard, contactsControllers.getContactById)
//   .delete("/:contactId", guard, contactsControllers.removeContact)
//   .put("/:contactId",guard,contactsControllers.updateContact)
//   .patch(
//     "/:contactId",
//     guard,
//     contactsControllers.updateStatusContact
//   );

module.exports = router;
