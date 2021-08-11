const { OperationRepository } = require("../repository");

class FinanceService {
  constructor() {
    this.repository = {
      operations: new OperationRepository(),
    };
  }

  async getAllFinance(userId, query) {
    const data = await this.repository.operations.getAllFinance(userId, query);
    const { userOperations, totalBalance } = data;
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

    const { userOperations, totalBalance } = data;
    return {
      userOperations,
      totalBalance,
    };
  }

  async getStatistic(userId, statisticFrom, statisticTo) {
    const data = await this.repository.operations.getStatistic(
      userId,
      statisticFrom,
      statisticTo
    );

    return data;
  }

  async changeOperation(userId, operationId, cahangedOperation) {
    const data = await this.repository.operations.changeOperation(
      userId,
      operationId,
      cahangedOperation
    );

    const { userOperations, totalBalance } = data;
    return {
      userOperations,
      totalBalance,
    };
  }

  async deleteOperation(userId, operationId, operationToDelete) {
    const data = await this.repository.operations.deleteOperation(
      userId,
      operationId,
      operationToDelete
    );

    const { userOperations, totalBalance } = data;
    return {
      userOperations,
      totalBalance,
    };
  }
}

module.exports = FinanceService;
