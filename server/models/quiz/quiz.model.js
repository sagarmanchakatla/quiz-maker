const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  noOfQuestions: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: Number, required: true },
      points: { type: Number, required: true },
    },
  ],
  totalPoints: { type: Number },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  isAIGenerated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", QuizSchema);
