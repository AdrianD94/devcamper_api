const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
//@desc Get all botcamps from db
//@route GET api/v1/bootcamps
//@access Public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//@desc Get a single bootcamp from db,based on the bootcamp id
//@route GET api/v1/bootcamps/:id
//@access Public

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`Resource with id of ${req.params.id} has not been found`,404))
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    console.log(error);
  
    next(error);
  }
};

//@desc Create bootcamp
//@route POST api/v1/bootcamps/
//@access Public

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    console.log(error);
    // res.status(400).json({ success: false });
    next(error);
  }
};
//@desc Update single bootcamp
//@route PUT api/v1/bootcamps/:id
//@access Public

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(new ErrorResponse(`Resource with id of ${req.params.id} has not been found`,404))
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
//@desc Delete single bootcamp
//@route DELETE api/v1/bootcamps/:id
//@access Public

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`Resource with id of ${req.params.id} has not been found`,404))
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
