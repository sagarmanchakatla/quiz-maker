import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createQuiz, generateAiQuiz } from "../../redux/slice/quizSlice";
import { ChevronLeft, Plus, X } from "lucide-react";

import AIQuizModal from "../../components/AiQuizModal";

export default function CreateQuiz() {
  const [showInitialModal, setShowInitialModal] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAIModal, setShowAIModal] = useState(false);

  const handleAIQuizSuccess = () => {
    navigate("/"); // or wherever you want to redirect after successful generation
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    numberOfQuestions: 1,
    tags: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", ""],
    correctAnswer: 0,
    points: 1, // Add default points value
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.quiz);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setShowInitialModal(false);
    setShowQuestionModal(true);
  };

  const addOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const updateOption = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const updatedQuestions = [...formData.questions, currentQuestion];
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));

    if (currentQuestionIndex + 1 < formData.numberOfQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentQuestion({
        question: "",
        options: ["", ""],
        correctAnswer: 0,
        points: 1,
      });
    } else {
      // All questions completed, submit the quiz
      const quizData = {
        title: formData.title,
        description: formData.description,
        noOfQuestions: formData.numberOfQuestions, // Changed from numberOfQuestions to noOfQuestions
        questions: updatedQuestions,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };
      dispatch(createQuiz(quizData));
      navigate("/");
    }
  };

  const handleGenerateClick = (e) => {
    e.preventDefault();
    dispatch(generateAiQuiz(formData));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: 'url("/images/question.jpg")',
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4  mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          <h1 className="text-3xl font-bold">Create Quiz</h1>
        </div>

        {/* Initial Modal */}
        {showInitialModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Quiz Details</h2>
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleInitialSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quiz title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Enter quiz description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.numberOfQuestions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        numberOfQuestions: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter comma-separated tags"
                  />
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Continue
                  </button>

                  <div className="flex items-center justify-center">
                    <div className="border-t border-gray-300 flex-grow"></div>
                    <span className="px-4 text-gray-500">or</span>
                    <div className="border-t border-gray-300 flex-grow"></div>
                  </div>
                </div>
              </form>
              <div className="w-full flex items-center justify-center">
                <span className="">Or</span>
                <button onClick={() => setShowAIModal(true)} className="">
                  Generate using AI
                </button>
              </div>
              <AIQuizModal
                isOpen={showAIModal}
                onClose={() => setShowAIModal(false)}
                onSuccess={handleAIQuizSuccess}
              />
            </div>
          </div>
        )}

        {/* Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Question {currentQuestionIndex + 1}
                </h2>
                <span className="text-sm text-gray-500">
                  {currentQuestionIndex + 1} of {formData.numberOfQuestions}
                </span>
              </div>

              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    required
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="correct"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() =>
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              correctAnswer: index,
                            }))
                          }
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          type="text"
                          required
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    ))}

                    {currentQuestion.options.length < 4 && (
                      <button
                        type="button"
                        onClick={addOption}
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <Plus size={24} className="text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mt-6"
                >
                  {currentQuestionIndex + 1 === formData.numberOfQuestions
                    ? "Create Quiz"
                    : "Next Question"}
                </button>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
