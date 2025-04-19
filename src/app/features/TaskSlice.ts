import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

interface ChecklistItem {
  task: string;
  done: boolean;
}

type Status =  "To Do" | "In Progress" | "Completed" | "Blocked";
type Priority =   "Low" | "Medium" | "High" | "Urgent";

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
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchTasks",
  async () => {
    const response = await axiosInstance.get("/tasks");
    return response.data;
  }
);

// Async thunk to update a task
export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updatedTask }: { taskId: number; updatedTask: Partial<Task> }) => {
    const response = await axiosInstance.patch(`/tasks/${taskId}`, updatedTask);
    return response.data as Task;
  }
);

// Async thunk to delete a task
export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: number) => {
    await axiosInstance.delete(`/tasks/${taskId}`);
    return taskId;
  }
);

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTask: (
      state,
      action: PayloadAction<{ taskId: number; updatedTask: Partial<Task> }>
    ) => {
      const { taskId, updatedTask } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedTask };
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
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      // Update task
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        const taskIndex = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = updatedTask;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update task";
      })
      // Delete task
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete task";
      });
  },
});

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const { addTask, deleteTask, updateTask, moveTask } = taskSlice.actions;
export default taskSlice.reducer;