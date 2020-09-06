const ErrorReponse = require("../utils/errorResponse");
const ErrorResponse = require("../utils/errorResponse");

const handleError = (err, req, res, next) => {
//   console.log(err.stack.red);
console.log(err);
  let error = { ...err };
  error.message = err.message;
  if (err.name === "CastError") {
    const message = `Resource with id of ${err.value} has not been found`;
    error = new ErrorResponse(message, 404);
  }

  if(err.code ==11000){
      const message = `Duplicate field value`
      error = new ErrorResponse(message,400);
  }

 if(err.name==="ValidationError"){
     const message = Object.values(err.errors).map(val=>val.message);
     error = new ErrorResponse(message,400);
 }

  console.log(err.name);
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = handleError;
