const Quiz = require("../../models/quiz/quiz.model");

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions, noOfQuestions, tags } = req.body;

    const totalPoints = questions.reduce(
      (sum, question) => sum + question.points,
      0
    );

    const quiz = new Quiz({
      title,
      description,
      tags,
      noOfQuestions,
      creator: req.user._id,
      questions,
      totalPoints,
    });

    await quiz.save();
    return res.status(201).json(quiz);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("creator", "username")
      .select("title description tags totalPoints createdAt creator");
    return res.json(quizzes);
  } catch (error) {
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};

exports.getQuizzesByCreator = async (req, res) => {
  try {
    const { userId } = req.params;
    const quizzes = await Quiz.find({ creator: userId })
      .select("title description totalPoints createdAt")
      .sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

exports.getQuizzesByTag = async (req, res) => {
  try {
    const { tag } = req.body;
    const quizzes = await Quiz.find({ tags: tag }).sort({ createdAt: -1 }); 
    return res.json(quizzes);
  } catch (error) {
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "creator",
      "username"
    );

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    return res.json(quiz);
  } catch (error) {
    return res.status(500).json({ error: "Server error: " + error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    // Calculate total points from all questions
    const totalPoints = questions.reduce(
      (sum, question) => sum + question.points,
      0
    );

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this quiz" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        questions,
        totalPoints,
      },
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this quiz" });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user._id })
      .select("title description totalPoints createdAt")
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

exports.validateQuiz = (req, res, next) => {
  const { title, questions } = req.body;

  if (
    !title ||
    !questions ||
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    return res.status(400).json({ error: "Invalid quiz format" });
  }

  for (const question of questions) {
    if (
      !question.question ||
      !question.options ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      typeof question.correctAnswer !== "number" ||
      typeof question.points !== "number" ||
      question.points <= 0
    ) {
      return res.status(400).json({
        error:
          "Each question must have content, at least 2 options, a valid correct answer, and positive points",
      });
    }

    if (question.correctAnswer >= question.options.length) {
      return res.status(400).json({
        error: "Correct answer index must be valid for the given options",
      });
    }
  }

  next();
};
