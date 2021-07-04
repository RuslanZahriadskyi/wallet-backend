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

    const newOperation = {
      date: req.body.date,
      type: req.body.type,
      category: req.body.category,
      comments: req.body.comments,
      amount: req.body.amount,
      balanceAfter: req.body.balanceAfter,
      typeBalanceAfter: req.body.typeBalanceAfter,
    };

    const operation = await financeServices.createOperation(
      userId,
      newOperation
    );

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        operation,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllFinance, createOperation };
