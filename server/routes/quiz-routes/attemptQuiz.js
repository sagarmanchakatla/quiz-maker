const express = require("express");
const router = express.Router();

const quizController = require("../../controllers/quiz/quiz");
const attemptedQuiz = require("../../controllers/quiz/attemptQuiz");
const auth = require("../../middleware/auth");

router.post("/:id/attempt", auth, attemptedQuiz.submitQuizAttempt);
router.get("/attempts", auth, attemptedQuiz.getUserAttempts);
router.get("/analytics", auth, attemptedQuiz.getQuizAnalytics);

module.exports = router;
