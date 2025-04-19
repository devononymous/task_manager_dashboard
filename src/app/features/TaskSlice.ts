import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

interface ChecklistItem {
  task: string;
  done: boolean;
}

type Status = "To Do" | "In Progress" | "Completed" | "Blocked";
type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string; // Use string for json-server compatibility
  assignees: string[];
  dueDate: string;   // Same here
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

// ✅ FETCH TASKS
export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchTasks",
  async () => {
    const response = await axiosInstance.get("/tasks");
    return response.data;
  }
);

export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, updatedTask }: { taskId: number; updatedTask: Partial<Task> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${taskId}`, updatedTask);
      return response.data as Task;
    } catch (err: any) {
      console.error("Update failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);
// ✅ DELETE TASK (with logging)
export const deleteTaskAsync = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: number, { rejectWithValue }) => {
    try {
      console.log("Deleting task:", taskId);
      await axiosInstance.delete(`/tasks/${taskId}`);
      return taskId;
    } catch (error: any) {
      console.error("Delete error:", error.message);
      return rejectWithValue("Failed to delete task.");
    }
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
      // Fetch
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
        state.error = action.error.message || "Failed to fetch tasks.";
      })
      // Update
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      // Delete
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      // Error Handling
     .addCase(updateTaskAsync.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || "Failed to update task";
})
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const { addTask, deleteTask, updateTask, moveTask } = taskSlice.actions;
export default taskSlice.reducer;
