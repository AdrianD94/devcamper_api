const express = require("express");
const { register, login, currentUser } = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/currentUser").get(protect, currentUser);

module.exports = router;
