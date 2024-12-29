import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import PrivateRoutes from "./components/PrivateRoutes";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import CreateQuiz from "./pages/CreateQuiz/CreateQuiz";
import Navbar from "./components/Navbar";
import AttemptQuiz from "./pages/AttemptQuiz/AttemptQuiz";
import BrowseQuizzesPage from "./pages/BrowseQuizzesPage/BrowseQuizzesPage ";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="browse-quizzes" element={<BrowseQuizzesPage />} />
            <Route
              path="/"
              element={
                <PrivateRoutes>
                  <Home />
                </PrivateRoutes>
              }
            />
            <Route
              path="/create-quiz"
              element={
                <PrivateRoutes>
                  <CreateQuiz></CreateQuiz>
                </PrivateRoutes>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <PrivateRoutes>
                  <AttemptQuiz />
                </PrivateRoutes>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
