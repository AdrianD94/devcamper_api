const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

//@desc Get all courses
//@route GET /api/v1/courses
//@route GET /api/v1/bootcamps/:bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc Get a single course
//@route GET /api/v1/courses/:id
//@access Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `Course with id of ${req.params.id} has not been found`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});
//@desc Add a single course
//@route POST /api/v1/bootcamps/:bootcampId/courses"
//@access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with id of ${req.params.bootcampId} has not been found`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

//@desc Update single course
//@route PUT api/v1/course/:id
//@access Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(
      new ErrorResponse(
        `Resource with id of ${req.params.id} has not been found`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: course });
});
//@desc Delete single course
//@route DELETE api/v1/course/:id
//@access Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        `Resource with id of ${req.params.id} has not been found`,
        404
      )
    );
  }
  await course.remove();

  res.status(200).json({ success: true, data: {} });
});
