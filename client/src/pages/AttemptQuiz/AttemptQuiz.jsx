import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Timer, CheckCircle, XCircle, Clock } from "lucide-react";
import { getQuizById } from "../../redux/slice/quizSlice";
import { submitQuizAttempt } from "../../redux/slice/attemptQuiz";

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quiz, loading } = useSelector((state) => state.quiz);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timePerQuestion, setTimePerQuestion] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(30);
  const [showResults, setShowResults] = useState(false);

  const calculateResults = () => {
    const totalPoints = answers.reduce((acc, curr) => {
      return acc + (curr.isCorrect ? quiz.questions[0].points : 0);
    }, 0);

    const totalTime = Object.values(timePerQuestion).reduce(
      (acc, curr) => acc + curr,
      0
    );
    const correctAnswers = answers.filter((a) => a.isCorrect).length;

    return {
      totalPoints,
      totalTime,
      correctAnswers,
      totalQuestions: quiz?.questions?.length || 0,
    };
  };

  useEffect(() => {
    console.log(quiz);
    if (id) {
      dispatch(getQuizById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (timer > 0 && !showResults) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !showResults) {
      handleNextQuestion();
    }
  }, [timer, showResults]);

  const handleAnswer = async (selectedAnswer) => {
    if (!quiz?.questions?.[currentQuestion]) return;

    const questionId = quiz.questions[currentQuestion]._id;
    const timeTaken = Date.now() - startTime;

    setTimePerQuestion((prev) => ({
      ...prev,
      [questionId]: Math.round(timeTaken / 1000),
    }));

    const newAnswer = {
      question: questionId,
      selectedAnswer,
      isCorrect:
        selectedAnswer === quiz.questions[currentQuestion].correctAnswer,
      timeTaken: Math.round(timeTaken / 1000),
    };

    setAnswers((prev) => [...prev, newAnswer]);

    if (currentQuestion === quiz.questions.length - 1) {
      const result = await dispatch(
        submitQuizAttempt({
          quizId: id,
          answers: [...answers, newAnswer],
        })
      );
      if (!result.error) {
        setShowResults(true);
      }
    } else {
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    if (quiz?.questions && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimer(30);
      setStartTime(Date.now());
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || !quiz) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div
      className="w-full  mx-auto p-6 min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/images/question.jpg")',
      }}
    >
      {!showResults && quiz?.questions?.length > 0 ? (
        <div className="bg-white max-w-3xl mx-auto rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <div className="text-sm">
              Total Questions: {quiz.questions.length}
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6">
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">
                {currentQuestion + 1}.{" "}
                {quiz.questions[currentQuestion].question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full p-4 text-left rounded border border-gray-200 hover:bg-gray-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full"></div>
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() =>
                  setCurrentQuestion((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestion === 0}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === quiz.questions.length - 1}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-center">
        {showResults && (
          <div className=" border rounded-lg shadow-md p-6 w-2/6 bg-white">
            <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-medium">Score</h3>
                <p className="text-2xl">
                  {calculateResults().totalPoints} points
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-medium">Time Taken</h3>
                <p className="text-2xl">
                  {formatTime(calculateResults().totalTime)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Question Summary</h3>
              {answers.map((answer, idx) => (
                <div key={idx} className="border-b py-2">
                  <div className="flex items-center gap-2">
                    {answer.isCorrect ? (
                      <CheckCircle className="text-green-500 w-5 h-5" />
                    ) : (
                      <XCircle className="text-red-500 w-5 h-5" />
                    )}
                    <span>Question {idx + 1}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Time taken: {answer.timeTaken} seconds
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <p className="text-lg">
                You got {calculateResults().correctAnswers} out of{" "}
                {calculateResults().totalQuestions} questions correct
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttemptQuiz;
