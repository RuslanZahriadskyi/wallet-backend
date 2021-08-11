const UserFinance = require("../schema/userOperation");
const OperationsSchema = require("../schema/operations");
const UserCategories = require("../schema/userCategory");
const mongoose = require("mongoose");

class OperationRepository {
  constructor() {
    this.finance = UserFinance;
    this.operation = OperationsSchema;
    this.category = UserCategories;
  }

  async getAllFinance(userId) {
    const result = await this.finance.findOne({ owner: userId }).populate({
      path: "userOperations",
      select: "amount category comments type date balanceAfter _id",
      options: { sort: { date: -1 } },
    });

    return result._doc;
  }

  async createOperation(owner, newOperation) {
    const previousOperation = await this.#getPreviousOperation(
      owner,
      newOperation
    );

    const recalculateOperations = await this.#recalculate(owner, newOperation);

    if (recalculateOperations.length > 0) {
      newOperation.balanceAfter =
        previousOperation.balanceAfter + newOperation.amount;

      if (newOperation.type === "outlay") {
        const { category } = await this.category.findOne({ owner }).populate({
          path: "category",
          select: "color value -_id",
        });

        const { color } = category.find(
          (item) =>
            item.value ===
            newOperation.category.charAt(0).toUpperCase() +
              newOperation.category.slice(1).toLowerCase()
        );

        newOperation.color = color;
      }

      const operation = await this.operation.create(newOperation);

      await this.finance.findOneAndUpdate(
        { owner },
        {
          $push: { userOperations: operation },
          totalBalance: newOperation.balanceAfter,
        }
      );

      await this.#updateOperations(owner, recalculateOperations, newOperation);

      return await this.getAllFinance(owner);
    } else {
      newOperation.balanceAfter =
        previousOperation.balanceAfter + newOperation.amount;

      if (newOperation.type === "outlay") {
        const { category } = await this.category.findOne({ owner }).populate({
          path: "category",
          select: "color value -_id",
        });

        const { color } = category.find(
          (item) =>
            item.value ===
            newOperation.category.charAt(0).toUpperCase() +
              newOperation.category.slice(1).toLowerCase()
        );

        newOperation.color = color;
      }

      const operation = await this.operation.create(newOperation);

      await this.finance.findOneAndUpdate(
        { owner },
        {
          $push: { userOperations: operation },
          totalBalance: newOperation.balanceAfter,
        },
        { new: true }
      );

      return await this.getAllFinance(owner);
    }
  }

  async getStatistic(userId, statisticFrom, statisticTo) {
    const monthStatistic = await this.operation.aggregate([
      {
        $match: {
          $and: [
            { owner: mongoose.Types.ObjectId(userId) },
            { date: { $gte: statisticFrom, $lt: statisticTo } },
            { type: "outlay" },
          ],
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: "$amount" },
          color: { $max: "$color" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
          color: 1,
        },
      },
      { $sort: { name: 1 } },
    ]);

    const incomeAndOutlayAmount = await this.operation.aggregate([
      {
        $match: {
          $and: [
            { owner: mongoose.Types.ObjectId(userId) },
            { date: { $gte: statisticFrom, $lt: statisticTo } },
          ],
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
    ]);

    return { monthStatistic, incomeAndOutlayAmount };
  }

  async changeOperation(userId, operationId, changedOperation) {
    await this.operation.findOneAndUpdate(
      { _id: operationId },
      {
        date: changedOperation.date,
      }
    );

    const previousOperation = await this.#getPreviousOperation(
      userId,
      changedOperation
    );

    const updatedOperation = await this.#changedOperation(
      operationId,
      userId,
      changedOperation,
      previousOperation.balanceAfter
    );

    const recalculateOperations = await this.#recalculate(
      userId,
      changedOperation
    );

    if (recalculateOperations.length > 0) {
      await this.#updateOperations(
        userId,
        recalculateOperations,
        updatedOperation.operation
      );

      return await this.getAllFinance(userId);
    }

    return await this.getAllFinance(userId);
  }

  async deleteOperation(userId, operationId, operationToDelete) {
    await this.#operationDelete(userId, operationId);

    const previousOperation = await this.#getPreviousOperation(
      userId,
      operationToDelete
    );

    const recalculateOperations = await this.#recalculate(
      userId,
      operationToDelete
    );

    if (recalculateOperations.length > 0) {
      await this.#updateOperations(
        userId,
        recalculateOperations,
        previousOperation
      );

      return await this.getAllFinance(userId);
    } else {
      return await this.getAllFinance(userId);
    }
  }

  async #changedOperation(operationId, userId, changedOperation, balanceAfter) {
    const operation = await this.operation.findOneAndUpdate(
      {
        _id: operationId,
      },
      {
        date: changedOperation.date,
        category: changedOperation.category,
        comments: changedOperation.comments,
        amount: changedOperation.amount,
        type: changedOperation.type,
        balanceAfter: balanceAfter + changedOperation.amount,
      },
      {
        fields: {
          date: 1,
          category: 1,
          comments: 1,
          amount: 1,
          type: 1,
          balanceAfter: 1,
        },
        new: true,
      }
    );

    await this.finance.findOneAndUpdate(
      { owner: userId },
      {
        totalBalance: operation.balanceAfter,
      }
    );

    return { operation, totalBalance: operation.balanceAfter };
  }

  async #getBalance(userId) {
    const { totalBalance } = await this.finance.findOne({
      owner: userId,
    });

    return totalBalance;
  }

  async #getPreviousOperation(userId, operation) {
    let previousOperation = await this.operation
      .find({
        owner: userId,
        date: { $lt: operation.date },
      })
      .sort({ date: -1 })
      .limit(1);

    if (previousOperation.length <= 0 || !previousOperation) {
      previousOperation = {};
      previousOperation.balanceAfter = 0;

      return previousOperation;
    }

    return previousOperation[0];
  }

  async #recalculate(userId, operation) {
    const recalculateOperations = await this.operation.aggregate([
      {
        $match: {
          $and: [
            { owner: mongoose.Types.ObjectId(userId) },
            { date: { $gt: operation.date } },
          ],
        },
      },
      { $sort: { date: 1 } },
    ]);

    return recalculateOperations;
  }

  async #updateOperations(userId, operations, operation) {
    await this.finance.findOneAndUpdate(
      { owner: userId },
      { totalBalance: operation.balanceAfter }
    );

    const newOperations = await (async () => {
      let recalculatedOperations = [];

      for (let i = 0; i < operations.length; i++) {
        const totalBalance = await this.#getBalance(userId);

        const operationUpdate = await this.operation.findOneAndUpdate(
          { _id: operations[i]._id },
          { balanceAfter: totalBalance + operations[i].amount },
          {
            fields: {
              date: 1,
              category: 1,
              comments: 1,
              amount: 1,
              type: 1,
              balanceAfter: 1,
            },
            new: true,
          }
        );

        await this.finance.findOneAndUpdate(
          { owner: userId },
          {
            totalBalance: operationUpdate.balanceAfter,
          }
        );

        recalculatedOperations.push(operationUpdate);
      }

      return recalculatedOperations;
    })();

    return newOperations;
  }

  async #operationDelete(userId, operationId) {
    await this.operation.findOneAndDelete({
      _id: operationId,
    });

    await this.finance.findOneAndUpdate(
      { owner: userId },
      {
        $pull: { userOperations: operationId },
      }
    );
  }
}

module.exports = OperationRepository;
