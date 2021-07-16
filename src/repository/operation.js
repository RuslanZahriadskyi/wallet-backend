const UserFinance = require("../schema/userOperation");
const OperationsSchema = require("../schema/operations");
const mongoose = require("mongoose");

class OperationRepository {
  constructor() {
    this.finance = UserFinance;
    this.operation = OperationsSchema;
  }

  async getAllFinance(userId) {
    const result = await this.finance.findOne({ owner: userId }).populate({
      path: "userOperations",
      select: "amount category comments type date balanceAfter -_id",
    });

    return result._doc;
  }

  async createOperation(owner, newOperation) {
    const { totalBalance } = await this.finance.findOne({ owner });

    if (newOperation.type === "income") {
      newOperation.balanceAfter = totalBalance + newOperation.amount;
    } else {
      newOperation.balanceAfter = totalBalance - newOperation.amount;
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

    return { totalBalance: addOperation.totalBalance, newOperation };
  }

  async getStatistic(userId, statisticFrom, statisticTo) {
    console.log(userId);
    console.log(statisticFrom);
    console.log(statisticTo);
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
