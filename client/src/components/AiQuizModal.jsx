import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateAiQuiz } from "../redux/slice/quizSlice";
import { X } from "lucide-react";

const AIQuizModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    noOfQuestions: 5,
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check if user is authenticated
    if (!authState.token) {
      setError("Please login to generate a quiz");
      setLoading(false);
      return;
    }

    try {
      const aiQuizData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        noOfQuestions: parseInt(formData.noOfQuestions),
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      const resultAction = await dispatch(generateAiQuiz(aiQuizData));

      if (generateAiQuiz.fulfilled.match(resultAction)) {
        onSuccess();
        onClose();
      } else if (generateAiQuiz.rejected.match(resultAction)) {
        setError(resultAction.payload || "Failed to generate quiz");
      }
    } catch (err) {
      setError(err.message || "An error occurred while generating the quiz");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Generate AI Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
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
              Difficulty Level
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={formData.noOfQuestions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  noOfQuestions: e.target.value,
                }))
              }
              className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., history, science, general"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium mt-6 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors`}
          >
            {loading ? "Generating Quiz..." : "Generate Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIQuizModal;
