import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, selectTheme } from "./app/features/ThemeSlice";  
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import './App.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme()); 
  };

  return (
    <div className={`app-container ${theme}`} >
      <button 
        className="theme-toggle-btn flex flex-row justify-end" 
        onClick={handleThemeToggle}
      >
        {theme === "light" ? "🌙" : "🌞"} 
      </button>
      <div className="flex">

      <TaskForm />
      <TaskList />
      </div>
    </div>
  );
};

export default App;
