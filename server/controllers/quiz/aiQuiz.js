const Quiz = require("../../models/quiz/quiz.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google AI with error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parseAIResponseToQuizFormat = (aiResponse) => {
  try {
    // Handle potential string formatting issues
    let cleanedResponse = aiResponse.trim();

    // Sometimes AI might wrap the response in backticks or code blocks
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace("```json", "")
        .replace("```", "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```/g, "");
    }

    const parsedQuestions = JSON.parse(cleanedResponse);

    // Validate the structure of each question
    return parsedQuestions.map((q, index) => {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctAnswer !== "number" ||
        !q.points
      ) {
        throw new Error(`Invalid question format at index ${index}`);
      }
      return {
        question: q.question, // Match your model's expected structure
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
      };
    });
  } catch (error) {
    console.error("Parsing error:", error);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
};

// const parseAIResponseToQuizFormat = (aiResponse) => {
//   try {
//     // Handle potential string formatting issues
//     let cleanedResponse = aiResponse.trim();

//     // Remove any code block markers
//     if (cleanedResponse.startsWith("```json")) {
//       cleanedResponse = cleanedResponse
//         .replace("```json", "")
//         .replace("```", "")
//         .trim();
//     } else if (cleanedResponse.startsWith("```")) {
//       cleanedResponse = cleanedResponse.replace(/```/g, "").trim();
//     }

//     // Handle potential single quote issues
//     cleanedResponse = cleanedResponse.replace(
//       /(?<=:\s*)"([^"]*)'([^"]*)"(?=\s*[,}\]])/g,
//       '"$1\\\'$2"'
//     );

//     // Fix potential unescaped quotes within strings
//     cleanedResponse = cleanedResponse.replace(
//       /(?<=:\s*)"([^"]*)"([^"]*)"(?=\s*[,}\]])/g,
//       '"$1\\"$2"'
//     );

//     // Additional cleanup for common AI response issues
//     cleanedResponse = cleanedResponse
//       // Remove any trailing commas before closing brackets/braces
//       .replace(/,(\s*[}\]])/g, "$1")
//       // Fix potential spacing issues around colons
//       .replace(/"\s*:\s*"/g, '":"')
//       // Ensure proper array formatting
//       .replace(/\]\s*\[/g, "], [");

//     let parsedQuestions;
//     try {
//       parsedQuestions = JSON.parse(cleanedResponse);
//     } catch (parseError) {
//       console.error("Initial parsing failed:", parseError);
//       // If parsing fails, try to fix common JSON structure issues
//       cleanedResponse = cleanedResponse
//         // Ensure the response is wrapped in an array if it isn't
//         .replace(/^\s*{/, "[{")
//         .replace(/}\s*$/, "}]");
//       parsedQuestions = JSON.parse(cleanedResponse);
//     }

//     // Ensure we're working with an array
//     if (!Array.isArray(parsedQuestions)) {
//       parsedQuestions = [parsedQuestions];
//     }

//     // Validate and normalize the structure of each question
//     return parsedQuestions.map((q, index) => {
//       // Validate required fields
//       if (
//         !q.question ||
//         !q.options ||
//         !q.correctAnswer === undefined ||
//         !q.points
//       ) {
//         throw new Error(`Question ${index + 1} is missing required fields`);
//       }

//       // Ensure options is an array
//       if (!Array.isArray(q.options)) {
//         if (typeof q.options === "string") {
//           q.options = q.options.split(",").map((opt) => opt.trim());
//         } else {
//           throw new Error(`Options for question ${index + 1} must be an array`);
//         }
//       }

//       // Validate options length
//       if (q.options.length !== 4) {
//         throw new Error(`Question ${index + 1} must have exactly 4 options`);
//       }

//       // Normalize correctAnswer to number
//       if (typeof q.correctAnswer === "string") {
//         q.correctAnswer = parseInt(q.correctAnswer, 10);
//       }

//       // Validate correctAnswer range
//       if (
//         isNaN(q.correctAnswer) ||
//         q.correctAnswer < 0 ||
//         q.correctAnswer > 3
//       ) {
//         throw new Error(
//           `Question ${
//             index + 1
//           } has invalid correctAnswer: must be between 0 and 3`
//         );
//       }

//       // Normalize points to number
//       if (typeof q.points === "string") {
//         q.points = parseInt(q.points, 10);
//       }

//       return {
//         question: q.question.trim(),
//         options: q.options.map((opt) => opt.trim()),
//         correctAnswer: q.correctAnswer,
//         points: q.points,
//       };
//     });
//   } catch (error) {
//     console.error("Detailed parsing error:", {
//       error: error.message,
//       stack: error.stack,
//       originalResponse: aiResponse,
//     });
//     throw new Error(`Failed to parse AI response: ${error.message}`);
//   }
// };

const generateQuizPrompt = (
  title,
  description,
  difficulty,
  noQuestions = 5
) => {
  const pointsMap = {
    easy: 5,
    medium: 10,
    hard: 15,
  };

  return `Generate a quiz about "${title}" with the following description: "${description}".
Please create exactly ${noQuestions} multiple choice questions.

Requirements:
- Difficulty level: ${difficulty}
- Each question must have exactly 4 options
- Points per question: ${pointsMap[difficulty]} points
- The correct answer should be indicated by its index (0-3)

Format your response as a valid JSON array like this:
[
  {
    "question": "What is...",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": 2,
    "points": ${pointsMap[difficulty]}
  }
]

Make sure all questions are of ${difficulty} difficulty level.
IMPORTANT: Provide ONLY the JSON array, no additional text or formatting.`;
};

exports.generateQuiz = async (req, res) => {
  try {
    const { title, description, difficulty, noOfQuestions } = req.body;
    // Input validation
    if (!title || !description || !difficulty) {
      return res.status(400).json({
        error: "Title, description, and difficulty level are required",
      });
    }

    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({
        error: "Difficulty must be either 'easy', 'medium', or 'hard'",
      });
    }

    // Initialize model with error handling
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    if (!model) {
      throw new Error("Failed to initialize Gemini model");
    }

    // Generate prompt
    const prompt = generateQuizPrompt(
      title,
      description,
      difficulty,
      noOfQuestions
    );
    // Get response from Gemini with error handling
    const result = await model.generateContent(prompt);
    // console.log(result);

    if (!result || !result.response) {
      throw new Error("No response received from Gemini");
    }

    const response = await result.response;
    const aiResponse = response.text();

    if (!aiResponse) {
      throw new Error("Empty response from Gemini");
    }
    
    const questions = parseAIResponseToQuizFormat(aiResponse);
    console.log(questions);
    
    const totalPoints = questions.reduce(
      (sum, question) => sum + question.points,
      0
    );

    
    const quiz = new Quiz({
      title,
      description,
      creator: req.user._id,
      questions,
      noOfQuestions,
      totalPoints,
      difficulty: difficulty.toLowerCase(),
      isAIGenerated: true,
    });
    
    const savedQuiz = await quiz.save();
    
    return res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return res.status(500).json({
      error: `Failed to generate quiz: ${error.message}`,
      details: error.stack,
    });
  }
};

exports.regenerateQuizQuestion = async (req, res) => {
  try {
    const { quizId, questionIndex } = req.params;

    if (!quizId || questionIndex === undefined) {
      return res
        .status(400)
        .json({ error: "Quiz ID and question index are required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this quiz" });
    }

    const pointsMap = {
      easy: 5,
      medium: 10,
      hard: 15,
    };

   
    const prompt = `Generate a single ${
      quiz.difficulty
    } difficulty multiple choice question about "${quiz.title}".
Return ONLY a JSON object with this exact structure:
{
  "question": "Your question text here",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": 0,
  "points": ${pointsMap[quiz.difficulty]}
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    
    let newQuestion = parseAIResponseToQuizFormat([JSON.parse(aiResponse)])[0];

    
    quiz.questions[questionIndex] = newQuestion;

    
    quiz.totalPoints = quiz.questions.reduce(
      (sum, question) => sum + question.points,
      0
    );

    const updatedQuiz = await quiz.save();
    return res.json(updatedQuiz);
  } catch (error) {
    console.error("Question regeneration error:", error);
    return res.status(500).json({
      error: "Failed to regenerate question",
      details: error.message,
    });
  }
};
