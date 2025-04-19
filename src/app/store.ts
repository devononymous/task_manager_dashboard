import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./features/TaskSlice";
import filterReducer from "./features/filterSlice";
import themeReducer from "./features/ThemeSlice";

export const store = configureStore({
  reducer: {
    tasks:taskReducer,
    filters:filterReducer,
    theme:themeReducer,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


