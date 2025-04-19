import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { Task } from "../app/features/TaskSlice"; // ✅ Corrected import

const statusColors: Record<Task["status"], string> = {
        "All": "bg-gray-100 text-gray-800",
  "To Do": "bg-gray-200 text-gray-800",
  "In Progress": "bg-yellow-200 text-yellow-800",
  "Completed": "bg-green-200 text-green-800",
  "Blocked": "bg-red-200 text-red-800",
};

const priorityColors: Record<Task["priority"], string> = {
        All: "bg-gray-100 text-gray-800",
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Urgent: "bg-red-100 text-red-800",
};

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  return (
<div className="p-4 md:p-6 mt-2 h-screen overflow-y-auto w-full">
  <p className="text-2xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">Tasks List</p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {tasks.map((task) => (
      <div
        key={task.id}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-4 md:p-5 transition-all"
      >
        <div className="flex gap-4 md:gap-6 items-start mb-3">
          <div className="flex-1">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
          </div>
          <div className="flex flex-col items-end space-y-1 text-sm">
            <span className="font-semibold">Status</span>
            <span className={`px-2 py-0.5 rounded ${statusColors[task.status]}`}>
              {task.status}
            </span>
            <span className="font-semibold mt-2">Priority</span>
            <span className={`px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className="mt-4 font-semibold">Assigned By</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>🕒 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          <div className="flex flex-wrap gap-1">
            {task.assignees.map((person, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
              >
                {person}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}

    {tasks.length === 0 && (
      <div className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-10">
        No tasks available. Add one to get started!
      </div>
    )}
  </div>
</div>



  );
};

export default TaskList;
