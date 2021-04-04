let AppError = require("../utils/AppError");

let handleMongooseValidation = (err) => {
  let message = Object.values(err.errors)
    .map((err) => err.message)
    .join(" , ");
  return new AppError(message, 400);
};

let handleInvalidMongoId = (e) => {
  return new AppError("Invalid Id", 404);
};

let handleDuplicatedField = (e) => {
  let duplicatedValue = e.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  return new AppError(`value "${duplicatedValue}" already exists`, 400);
};
module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    err = handleMongooseValidation(err);
  }
  if (err.name === "CastError") {
    err = handleInvalidMongoId(err);
  }
  if (err.code === 11000) {
    err = handleDuplicatedField(err);
  }
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";

  let resData = {
    status,
    message: err.message,
    err,
  };
  if (process.env.NODE_ENV === "production") {
    delete resData["err"];
  }
  res.status(statusCode).json(resData);
};
