import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuizzes } from "../../redux/slice/quizSlice";
import { Tag } from "lucide-react";
import QuizCard from "../../components/QuizCard";

const BrowseQuizzesPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const dispatch = useDispatch();
  const { quizzes, loading } = useSelector((state) => state.quiz);

  const commonTags = [
    "Mathematics",
    "Science",
    "History",
    "Programming",
    "Literature",
    "Geography",
    "General Knowledge",
  ];

  useEffect(() => {
    dispatch(getAllQuizzes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredQuizzes(quizzes);
    } else {
      const filtered = quizzes.filter((quiz) =>
        selectedTags.some((tag) => quiz.tags.includes(tag))
      );
      setFilteredQuizzes(filtered);
    }
  }, [selectedTags, quizzes]);

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const clearFilters = () => setSelectedTags([]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 ">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          The best place to
          <span className="text-purple-600"> learn </span>
          and
          <span className="text-yellow-500"> play</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Discover thousands of fun and interactive learning activities
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-12 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Browse by Category
          </h2>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {commonTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-purple-600 text-white"
                  : "bg-purple-50 text-purple-600 hover:bg-purple-100"
              }`}
            >
              <Tag className="inline-block w-4 h-4 mr-1" />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-8">
        <p className="text-gray-600 font-medium">
          Showing {filteredQuizzes.length}{" "}
          {filteredQuizzes.length === 1 ? "quiz" : "quizzes"}
          {selectedTags.length > 0 && (
            <span> for {selectedTags.join(", ")}</span>
          )}
        </p>
      </div>

      {/* Pinterest-style Grid */}
      <div className="columns-1 md:columns-2 lg:columns-4 gap-6">
        {filteredQuizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} selectedTags={selectedTags} />
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl">
          <p className="text-gray-600 text-lg mb-4">
            No quizzes found for the selected categories.
          </p>
          <button
            onClick={clearFilters}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseQuizzesPage;
