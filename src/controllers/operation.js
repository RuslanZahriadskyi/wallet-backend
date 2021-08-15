const { HttpCode } = require("../helpers/constants");
const { FinanceService } = require("../services");
const financeServices = new FinanceService();

const getAllFinance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const finances = await financeServices.getAllFinance(userId, req.query);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      response: {
        ...finances,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createOperation = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const newOperation = await operationInfo(req.body, userId);

    const operation = await financeServices.createOperation(
      userId,
      newOperation
    );

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        ...operation,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStatistic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.params;
    const getMonth = new Date(`${year}, ${month}`).getMonth();
    const statisticFrom = Number(Date.parse(new Date(year, getMonth, 2)));
    const statisticTo = Number(Date.parse(new Date(year, getMonth + 1, 1)));

    const statistic = await financeServices.getStatistic(
      userId,
      statisticFrom,
      statisticTo
    );

    let income = await statistic.incomeAndOutlayAmount.find(
      (item) => item.name === "income"
    );

    if (!income) {
      income = { count: 0 };
    }

    let outlay = await statistic.incomeAndOutlayAmount.find(
      (item) => item.name === "outlay"
    );

    if (!outlay) {
      outlay = { count: 0 };
    }

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      statistics: {
        monthOutlay: statistic.monthStatistic,
        income: income.count,
        outlay: outlay.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changeOperation = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const newOperation = await operationInfo(req.body, userId);

    const changedOperation = await financeServices.changeOperation(
      userId,
      req.params.operationId,
      newOperation
    );

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        ...changedOperation,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteOperation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { operationId } = req.params;

    const operation = await operationInfo(req.body, userId);

    const deletedOperation = await financeServices.deleteOperation(
      userId,
      operationId,
      operation
    );

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: deletedOperation,
    });
  } catch (error) {
    next(error);
  }
};

const operationInfo = (operation, userId) => {
  const { date, type, category, comments, amount } = operation;

  let newOperation = {
    date,
    type,
    amount,
    owner: userId,
  };

  if (category) {
    newOperation = { ...newOperation, category };
  }

  if (comments) {
    newOperation = { ...newOperation, comments };
  }

  if (type === "income") {
    newOperation = { ...newOperation, amount };
  } else {
    newOperation = { ...newOperation, amount: -amount };
  }

  return newOperation;
};

module.exports = {
  getAllFinance,
  createOperation,
  getStatistic,
  changeOperation,
  deleteOperation,
};
