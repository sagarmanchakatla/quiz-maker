import React from "react";
import { Tag, Clock, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuizCard = ({ quiz, selectedTags = [] }) => {
  const navigate = useNavigate();

  const randomImageIndex = Math.floor(Math.random() * 4) + 1; // Assuming you have 5 images
  const imageUrl = `/images/${randomImageIndex}.jpeg`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="relative">
        <img
          src={imageUrl}
          alt={quiz.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {quiz.creator?.username}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{quiz.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {quiz.tags.map((tag) => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                selectedTags.includes(tag)
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Tag className="inline-block w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-blue-600" />
            {new Date(quiz.createdAt).toLocaleDateString()}
          </span>
          {/* <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium">
            10 Questions
          </span> */}
        </div>

        <button
          onClick={() => navigate(`/quiz/${quiz._id}`)}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
        >
          Start Quiz
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
