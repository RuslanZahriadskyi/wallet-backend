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
    return { userOperations, totalBalance, typeTotalBalance };
  }

  async createOperation(userId, newOperation) {
    const data = await this.repository.operations.createOperation(
      userId,
      newOperation
    );

    const { totalBalance, userOperations, typeTotalBalance } = data;
    return { totalBalance, userOperations, typeTotalBalance };
  }
}

module.exports = FinanceService;
