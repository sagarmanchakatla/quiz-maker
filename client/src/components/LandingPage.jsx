import React from "react";
import { Trophy, Brain, ArrowRight, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="max-w-6xl  flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-blue-600 font-medium">Quiz Platform</span>
              </div>
              <h1 className="text-5xl font-bold text-gray-900">
                Learn Through Interactive Quizzes 🎯
              </h1>
              <p className="text-xl text-gray-600">
                Join millions of learners in our gamified education platform.
                Create, compete, and master new skills.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigate("/create-quiz");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Create Quiz
              </button>
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                Join Quiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-semibold text-black">2,000+</span> active
                learners
              </p>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full opacity-50" />
              <div className="relative bg-white rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-6">
                  Choose Categories
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      name: "Science",
                      icon: "🚀",
                      color: "bg-red-50",
                      textColor: "text-red-600",
                    },
                    {
                      name: "Geography",
                      icon: "🌍",
                      color: "bg-green-50",
                      textColor: "text-green-600",
                    },
                    {
                      name: "Biology",
                      icon: "🧬",
                      color: "bg-purple-50",
                      textColor: "text-purple-600",
                    },
                    {
                      name: "Sports",
                      icon: "⚽",
                      color: "bg-blue-50",
                      textColor: "text-blue-600",
                    },
                  ].map((category) => (
                    <div
                      key={category.name}
                      className={`${category.color} p-4 rounded-2xl hover:opacity-90 cursor-pointer transition-opacity`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <span className="text-2xl">{category.icon}</span>
                        <span className={`font-medium ${category.textColor}`}>
                          {category.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className=" py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Explore Our Features</h2>
            <p className="text-gray-600">
              Everything you need to make learning engaging and fun
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8 text-blue-500" />,
                title: "Create Custom Quizzes",
                description:
                  "Design your own quizzes with our easy-to-use interface",
              },
              {
                icon: <Trophy className="w-8 h-8 text-yellow-500" />,
                title: "Join Live Competitions",
                description:
                  "Participate in real-time quizzes with players worldwide",
              },
              {
                icon: <Award className="w-8 h-8 text-green-500" />,
                title: "Track Your Progress",
                description: "Get detailed insights into your learning journey",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Top Learners 🏆</h3>
            <button className="text-blue-600 font-medium hover:text-blue-700">
              View All Rankings
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: "Emma Watson", score: "2000", rank: 1 },
              { name: "John Smith", score: "1850", rank: 2 },
              { name: "Sarah Parker", score: "1700", rank: 3 },
            ].map((user) => (
              <div
                key={user.name}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-medium text-blue-600">
                    {user.rank}
                  </span>
                  <div className="w-10 h-10 bg-blue-200 rounded-full" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{user.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
