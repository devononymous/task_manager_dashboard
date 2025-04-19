import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { PayloadAction } from "@reduxjs/toolkit";

interface ChecklistItem {
  task: string;
  done: boolean;
}

type Status = "All" | "To Do" | "In Progress" | "Completed" | "Blocked";
type Priority = "All" | "Low" | "Medium" | "High" | "Urgent";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  assignees: string[];
  dueDate: Date;
  tags: string[];
  comments: string[];
  checklist: ChecklistItem[];
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    moveTask: (
      state,
      action: PayloadAction<{ taskId: number; newStatus: Task["status"] }>
    ) => {
      const { taskId, newStatus } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = newStatus;
      }
    },
  },
});

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const { addTask, removeTask, updateTask,moveTask } = taskSlice.actions;
export default taskSlice.reducer;
