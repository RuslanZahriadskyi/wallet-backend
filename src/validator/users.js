const Joi = require("joi");
const { Subscription, HttpCode } = require("../helpers/constants");

const shemaUpdateSubscriptionStatus = Joi.object({
  subscription: Joi.string()
    .valid(Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS)
    .required(),
});

const validate = (shema, body, next) => {
  const { error } = shema.validate(body);

  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Filed: ${message.replace(/"/g, "")}`,
      data: "Bad Request",
    });
  }
  next();
};

module.exports.validateUpdateSubscriptionStatus = (req, _, next) => {
  return validate(shemaUpdateSubscriptionStatus, req.body, next);
};
