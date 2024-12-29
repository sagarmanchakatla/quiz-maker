const Quiz = require("../../models/quiz/quiz.model");
const QuizAttempt = require("../../models/quiz/attemptedQuiz.model");

exports.submitQuizAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const { answers } = req.body;

    let totalScore = 0;
    const gradedAnswers = answers.map((answer, idx) => {
      const question = quiz.questions[idx];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;
      totalScore += pointsEarned;

      return {
        question: question._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        pointsEarned,
      };
    });

    const attempt = new QuizAttempt({
      user: req.user._id,
      quiz: quiz._id,
      answers: gradedAnswers,
      totalScore,
    });

    await attempt.save();
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate("quiz", "title totalPoints")
      .sort("-completedAt");
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuizAnalytics = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ quiz: req.params.id });
    const analytics = {
      totalAttempts: attempts.length,
      averageScore:
        attempts.reduce((acc, curr) => acc + curr.totalScore, 0) /
        attempts.length,
      highestScore: Math.max(...attempts.map((a) => a.totalScore)),
      lowestScore: Math.min(...attempts.map((a) => a.totalScore)),
    };
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
