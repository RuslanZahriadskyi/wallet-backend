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
    const { totalBalance } = await this.finance.findOne({ owner });

    const { category } = await this.category.findOne({ owner }).populate({
      path: "category",
      select: "color value -_id",
    });

    const { color } = category.find(
      (item) => item.value === newOperation.category
    );

    if (newOperation.type === "income") {
      newOperation.balanceAfter = totalBalance + newOperation.amount;
    } else {
      newOperation.balanceAfter = totalBalance - newOperation.amount;
      newOperation.color = color;
    }

    const operation = await this.operation.create(newOperation);

    const addOperation = await this.finance.findOneAndUpdate(
      { owner },
      {
        $push: { userOperations: operation },
        totalBalance: newOperation.balanceAfter,
      },
      { new: true }
    );

    return { totalBalance: addOperation.totalBalance, newOperation: {} };
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
}

module.exports = OperationRepository;
