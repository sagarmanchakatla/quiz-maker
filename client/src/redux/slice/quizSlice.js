import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const createQuiz = createAsyncThunk(
  "quiz/createQuiz",
  async (quizData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      console.log("Request payload:", quizData); // Add this line
      const response = await fetch(`${API_URL}/api/quizzes/create-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("Error response:", data); // Add this line
        return rejectWithValue(data.error || "Failed to create quiz");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllQuizzes = createAsyncThunk(
  "quiz/getAllQuizzes",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quizzes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuizzesByCreator = createAsyncThunk(
  "quiz/getQuizzesByCreator",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quizzes/creator/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuizzesByTag = createAsyncThunk(
  "quiz/getQuizzesByTag",
  async (tag, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quizzes/tag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tag }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getQuizById = createAsyncThunk(
  "quiz/getQuizById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quizzes/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quiz/updateQuiz",
  async ({ id, quizData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quizzes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "quiz/deleteQuiz",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMyQuizzes = createAsyncThunk(
  "quiz/getMyQuizzes",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quizzes/my-quizs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateAiQuiz = createAsyncThunk(
  "quiz/generateAiQuiz",
  async (quizData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quizzes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to create quiz");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: [],
    quiz: null,
    myQuizzes: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetQuizState: (state) => {
      state.quizzes = [];
      state.quiz = null;
      state.myQuizzes = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Quiz
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.push(action.payload); // Add the new quiz to the list
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Quizzes
      .addCase(getAllQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(getAllQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Quiz by ID
      .addCase(getQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload;
      })
      .addCase(getQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Quizzes by Creator
      .addCase(getQuizzesByCreator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizzesByCreator.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(getQuizzesByCreator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get My Quizzes
      .addCase(getMyQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.myQuizzes = action.payload;
      })
      .addCase(getMyQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Quizzes by Tag
      .addCase(getQuizzesByTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizzesByTag.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(getQuizzesByTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Quiz
      .addCase(updateQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        const updatedQuizIndex = state.quizzes.findIndex(
          (quiz) => quiz._id === action.payload._id
        );
        if (updatedQuizIndex >= 0) {
          state.quizzes[updatedQuizIndex] = action.payload;
        }
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Quiz
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = state.quizzes.filter(
          (quiz) => quiz._id !== action.payload._id
        );
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateAiQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateAiQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAiQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.push(action.payload);
        state.error = null;
      });
  },
});

export const { resetQuizState } = quizSlice.actions;

export default quizSlice.reducer;
