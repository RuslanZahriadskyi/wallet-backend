const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const Subscription = {
  STARTER: "starter",
  PRO: "pro",
  BUSINESS: "business",
  NONE: "none",
};

const CategoryCosts = {
  MAIN: "main",
  FOOD: "food",
  AUTO: "auto",
  DEVELOP: "develop",
  KIDS: "kids",
  HOUSE: "house",
  EDUCATION: "education",
  OTHERS: "others",
};

const CategoryIncome = {
  REGULAR: "regular",
  IRREGULAR: "irregular",
};

module.exports = { HttpCode, Subscription, CategoryCosts, CategoryIncome };
