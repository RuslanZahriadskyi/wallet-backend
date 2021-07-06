const { OperationRepository } = require("../repository");

class FinanceService {
  constructor() {
    this.repository = {
      operations: new OperationRepository(),
    };
  }

  async getAllFinance(userId, query) {
    const data = await this.repository.operations.getAllFinance(userId, query);
    const { userOperations, totalBalance, typeTotalBalance } = data;
    return {
      userOperations,
      totalBalance,
    };
  }

  async createOperation(userId, newOperation) {
    const data = await this.repository.operations.createOperation(
      userId,
      newOperation
    );

    return data;
  }

  async getStatistic(userId, statisticFrom, statisticTo) {
    const data = await this.repository.operations.getStatistic(
      userId,
      statisticFrom,
      statisticTo
    );

    return data;
  }
}

module.exports = FinanceService;
