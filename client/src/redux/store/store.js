import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/authSlice";
import quizSlice from "../slice/quizSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    quiz: quizSlice,
  },
});

export default store;
