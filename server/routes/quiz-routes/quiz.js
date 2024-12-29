const express = require("express");
const router = express.Router();

const quizController = require("../../controllers/quiz/quiz");
const aiQuiz = require("../../controllers/quiz/aiQuiz");
const auth = require("../../middleware/auth");

router.post(
  "/create-quiz",
  auth,
  quizController.validateQuiz,
  quizController.createQuiz
);
router.get("/", quizController.getAllQuizzes);
router.get("/my-quizs", auth, quizController.getMyQuizzes);
router.get("/:id", auth, quizController.getQuizById);
router.put(
  "/:id",
  auth,
  quizController.validateQuiz,
  quizController.updateQuiz
);
router.delete("/:id", auth, quizController.deleteQuiz);

router.get("/creator/:userId", auth, quizController.getQuizzesByCreator);
router.post("/tag", auth, quizController.getQuizzesByTag);

router.post("/generate", auth, aiQuiz.generateQuiz);
router.post(
  "/regenerate-question/:quizId/:questionIndex",
  auth,
  aiQuiz.regenerateQuizQuestion
);

module.exports = router;
