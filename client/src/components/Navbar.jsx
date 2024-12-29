import { useState } from "react";
import { Search, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      // Implement search logic
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo and Search */}
          <div className="flex items-center gap-8">
            <h1
              onClick={() => navigate("/")}
              className="text-xl font-semibold cursor-pointer text-gray-900 flex items-center"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full mr-2"></div>
              QuizApp
            </h1>

            {/* Search with updated styling */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search quizzes..."
                className="w-80 pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/explore")}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Explore
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate("/my-quizzes")}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  My Quizzes
                </button>
                <button
                  onClick={() => navigate("/create-quiz")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Create Quiz
                </button>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
