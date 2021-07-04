const UserFinance = require("../schema/userOperation");

class OperationRepository {
  constructor() {
    this.finance = UserFinance;
  }

  async getAllFinance(userId) {
    const result = await this.finance.findOne({ owner: userId });
    return result._doc;
  }

  async createOperation(owner, newOperation) {
    const operation = await this.finance.findOneAndUpdate(
      { owner },
      {
        $push: { userOperations: newOperation },
        totalBalance: newOperation.balanceAfter,
        typeTotalBalance: newOperation.typeBalanceAfter,
      },
      { new: true, upsert: true }
    );

    return operation;
  }
}

module.exports = OperationRepository;
