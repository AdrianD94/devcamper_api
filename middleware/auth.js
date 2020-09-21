const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  // } else if (req.cookies.token) {
  //   token = req.cookies.token;
   }

  if (!token) {
    return next(new ErrorResponse("Unauthorize to access route", 401));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id);

    next();
  } catch (error) {
    return next(new ErrorResponse("Unauthorize to access route", 401));
  }
});

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User with ${req.user.role} role is not authorized to access this route `,
        403
      )
    );
  }
  next();
};
