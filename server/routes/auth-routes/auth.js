const router = require("express").Router();
const auth = require("../../middleware/auth");
const authController = require("../../controllers/auth/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
