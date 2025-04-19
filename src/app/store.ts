// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"; // Import these missing functions
import taskReducer from "./features/TaskSlice";
import themeReducer from "./features/ThemeSlice";
import filterReducer from "./features/filterSlice";
import storage from "redux-persist/lib/storage"; // Local storage for persistence

// Persist configuration
const persistConfig = {
  key: 'root',       // Unique key for the persisted state
  storage,           // Local storage (you can also use sessionStorage if needed)
  whitelist: ['tasks'],  // Only persist 'tasks' slice (filter and theme will not be persisted)
};

// Persisted task reducer
const persistedTaskReducer = persistReducer(persistConfig, taskReducer);

// Store setup with persisted reducer for tasks
const store = configureStore({
  reducer: {
    tasks: persistedTaskReducer,  // Persisted reducer for tasks
    theme: themeReducer,          // Normal reducer for theme (not persisted)
    filter: filterReducer,        // Normal reducer for filter
  },
});

// Persistor to manage the persistence of the store
const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
