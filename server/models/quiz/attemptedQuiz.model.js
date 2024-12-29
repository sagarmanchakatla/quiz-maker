const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedAnswer: { type: Number, required: true },
      isCorrect: { type: Boolean, required: true },
      pointsEarned: { type: Number, required: true },
    },
  ],
  totalScore: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
