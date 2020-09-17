const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

//@desc Get all reviews
//@route GET /api/v1/reviews
//@route GET /api/v1/bootcamps/:bootcampId/review
//@access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
//@desc Get signle review
//@route GET /api/v1/reviews/:reviewId

//@access Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with the id of ${req.params.reviewId}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});
//@desc create Review
//@route Post /api/v1/bootcamps/:bootcampId/review

//@access Private

exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `bootcamp with ${req.params.bootcampId} has not been found`
      )
    );
  }
 
  const userAlreadyAddAReviw = await Review.findOne({
    user: req.user.id,
    bootcamp: req.body.bootcamp,
  });
 
  if (userAlreadyAddAReviw) {
    return next(
      new ErrorResponse("User already added a review for this bootcamp"),
      400
    );
  }
  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});
//@desc update Review
//@route Post /api/v1//review/reviewId

//@access Private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.reviewId);
  
  if(!review){
      return next(new ErrorResponse(`Review with id of ${req.params.reviewId} has not been found`,404));
  }

  if(req.user.id !== review.user.toString() && req.user.role!="admin"){
      return next(new ErrorResponse(`User can't update this review`,403));
  }

  review = await Review.findByIdAndUpdate(req.params.reviewId,req.body,{
      new:true,
      runValidators:true
  })

  res.status(200).json({
    success: true,
    data: review,
  });
});
//@desc update Review
//@route Post /api/v1//review/reviewId

//@access Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.reviewId);
  
  if(!review){
      return next(new ErrorResponse(`Review with id of ${req.params.reviewId} has not been found`,404));
  }

  if(req.user.id !== review.user.toString() && req.user.role!="admin"){
      return next(new ErrorResponse(`User can't update this review`,403));
  }

  await review.remove()

  res.status(200).json({
    success: true,
    data: {},
  });
});
