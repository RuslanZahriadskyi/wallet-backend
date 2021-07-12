const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { HttpCode } = require("./helpers/constants");
const { apiLimit } = require("./config/rate-limit.json");
const { ErrorHandler } = require("./helpers/errorHandler");

const operationsRouter = require("./api/operation/operation");
const usersRouter = require("./api/users/users");
const categoryRouter = require("./api/category/category");
const swaggerRouter = require("./api/swagger/swagger");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: apiLimit.jsonLimit }));

app.use(
  "/api/",
  rateLimit({
    windowMs: apiLimit.windowMs,
    max: apiLimit.max,
    handler: (_req, _res, next) => {
      next(
        new ErrorHandler(
          HttpCode.BAD_REQUEST,
          "Too many accounts created from this IP, please try again after 15 minutes"
        )
      );
    },
  })
);

app.use("/api/users", usersRouter);
app.use("/api/operations", operationsRouter);
app.use("/api/category", categoryRouter);
app.use("/api-docs", swaggerRouter);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: `Your contacts on routes ${req.baseUrl}${req.originalUrl}`,
    data: "Not Found",
  });
});

app.use((err, _req, res, _next) => {
  err.status = err.status ? err.status : HttpCode.INTERNAL_SERVER_ERROR;
  res.status(err.status).json({
    status: err.status === 500 ? "fail" : "error",
    code: err.status,
    message: err.message,
    data: err.status === 500 ? "Internal Server Found" : err.data,
  });
});

module.exports = app;
