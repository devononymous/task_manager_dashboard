// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"; // Import these missing functions
import taskReducer from "./features/TaskSlice";
import themeReducer from "./features/ThemeSlice";
import filterReducer from "./features/filterSlice";
import storage from "redux-persist/lib/storage"; 
// Persist configuration
const persistConfig = {
  key: 'root',      
  storage,          
  whitelist: ['tasks'],  
};

// Persisted task reducer
const persistedTaskReducer = persistReducer(persistConfig, taskReducer);

// Store setup with persisted reducer for tasks
const store = configureStore({
  reducer: {
    tasks: persistedTaskReducer,  
    theme: themeReducer,          
    filter: filterReducer,      
  },
});

// Persistor to manage the persistence of the store
const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };
