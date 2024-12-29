import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuizzes } from "../../redux/slice/quizSlice";
import { Tag, Clock, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LandingPage from "../../components/LandingPage";
import QuizCard from "../../components/QuizCard";

// Home Page Component
const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizzes, loading } = useSelector((state) => state.quiz);

  useEffect(() => {
    dispatch(getAllQuizzes());
  }, [dispatch]);

  // Get only the 3 most recent quizzes
  const recentQuizzes = quizzes.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-blue-30">
      <LandingPage />

      {/* Featured Quizzes Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Featured Quizzes</h1>
          <button
            onClick={() => navigate("/browse-quizzes")}
            className="flex items-center text-pink-500 hover:text-pink-600 font-medium"
          >
            View all quizzes
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
