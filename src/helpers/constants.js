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

// const OutlayCategory = {
//   MAIN: "main",
//   FOOD: "food",
//   AUTO: "auto",
//   DEVELOP: "develop",
//   KIDS: "kids",
//   HOUSE: "house",
//   EDUCATION: "education",
//   OTHERS: "others",
// };

const OutlayCategory = [
  { value: "Основные расходы", color: "#FED057" },
  { value: "Продукты", color: "#FFD8D0" },
  { value: "Машина", color: "#FD9498" },
  { value: "Забота о себе", color: "#C5BAFF" },
  { value: "Забота о детях", color: "#6E78E8" },
  { value: "Товары для дома", color: "#4A56E2" },
  { value: "Образование", color: "#81E1FF" },
  { value: "Досуг", color: "#24CCA7" },
];

module.exports = { HttpCode, Subscription, OutlayCategory };
