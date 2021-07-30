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

const OutlayCategory = [
  { value: "Basic outlay", color: "#FED057" },
  { value: "Products", color: "#FFD8D0" },
  { value: "Car", color: "#FD9498" },
  { value: "Care of yourself", color: "#C5BAFF" },
  { value: "Care of children", color: "#6E78E8" },
  { value: "Household products", color: "#4A56E2" },
  { value: "Education", color: "#81E1FF" },
  { value: "Entertainment", color: "#24CCA7" },
];

module.exports = { HttpCode, Subscription, OutlayCategory };
