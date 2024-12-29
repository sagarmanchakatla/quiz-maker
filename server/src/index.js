require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const authRoutes = require("../routes/auth-routes/auth");
const quizRoutes = require("../routes/quiz-routes/quiz");
const attempQuizRoutes = require("../routes/quiz-routes/attemptQuiz");

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/quiz-attempts", attempQuizRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server Started at http://localhost:${process.env.PORT || 8000}`);
});
