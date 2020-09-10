const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

//@desc Get all botcamps from db
//@route GET api/v1/bootcamps
//@access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc Get a single bootcamp from db,based on the bootcamp id
//@route GET api/v1/bootcamps/:id
//@access Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with id of ${req.params.id} has not been found`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Create bootcamp
//@route POST api/v1/bootcamps/
//@access Public

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});
//@desc Update single bootcamp
//@route PUT api/v1/bootcamps/:id
//@access Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with id of ${req.params.id} has not been found`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
//@desc Delete single bootcamp
//@route DELETE api/v1/bootcamps/:id
//@access Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with id of ${req.params.id} has not been found`,
        404
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});
//@desc Get bootcamps within a range
//@route GET api/v1/bootcamps/radius/:zipcode/:distance
//@access Public

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 6378;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc Upload Photo for bootcap
//@route PUT api/v1/bootcamps/:id/photo
//@access Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp with id of ${req.params.id} has not been found`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a file ", 400));
  }
  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please add a image file", 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
