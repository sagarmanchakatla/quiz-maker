import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// Submit a quiz attempt
export const submitQuizAttempt = createAsyncThunk(
  "quizAttempt/submitQuizAttempt",
  async ({ quizId, answers }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(
        `${API_URL}/api/quiz-attempts/${quizId}/attempt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get user's quiz attempts
export const getUserAttempts = createAsyncThunk(
  "quizAttempt/getUserAttempts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_URL}/api/quiz-attempts/attempts`, {
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

// Get quiz analytics
export const getQuizAnalytics = createAsyncThunk(
  "quizAttempt/getQuizAnalytics",
  async (quizId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(
        `${API_URL}/api/quiz-attempts/analytics/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const quizAttemptSlice = createSlice({
  name: "quizAttempt",
  initialState: {
    currentAttempt: null,
    attempts: [],
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetAttemptState: (state) => {
      state.currentAttempt = null;
      state.attempts = [];
      state.analytics = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Quiz Attempt
      .addCase(submitQuizAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAttempt = action.payload;
        state.attempts.unshift(action.payload); // Add to beginning of attempts list
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Attempts
      .addCase(getUserAttempts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAttempts.fulfilled, (state, action) => {
        state.loading = false;
        state.attempts = action.payload;
      })
      .addCase(getUserAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Quiz Analytics
      .addCase(getQuizAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuizAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(getQuizAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAttemptState } = quizAttemptSlice.actions;

export const selectCurrentAttempt = (state) => state.quizAttempt.currentAttempt;
export const selectAttempts = (state) => state.quizAttempt.attempts;
export const selectAnalytics = (state) => state.quizAttempt.analytics;
export const selectAttemptLoading = (state) => state.quizAttempt.loading;
export const selectAttemptError = (state) => state.quizAttempt.error;

export default quizAttemptSlice.reducer;
