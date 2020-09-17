const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");
const advancedResults = require("../middleware/advancedResults");
const { authorize, protect } = require("../middleware/auth");
const Review = require("../models/Review");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router
  .route("/:reviewId")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect,authorize("user","admin"),deleteReview)

module.exports = router;
