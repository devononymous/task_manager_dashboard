import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { Task, moveTask, fetchTasks, updateTaskAsync, deleteTaskAsync } from "../app/features/TaskSlice";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

const statusColors: Record<Task["status"], string> = {
  "To Do": "bg-gray-200 text-gray-800",
  "In Progress": "bg-yellow-200 text-yellow-800",
  Completed: "bg-green-200 text-green-800",
  Blocked: "bg-red-200 text-red-800",
};

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const error = useSelector((state: RootState) => state.tasks.error);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Group tasks by status
  const tasksByStatus: Record<Task["status"], Task[]> = {
    "To Do": [],
    "In Progress": [],
    Completed: [],
    Blocked: [],
  };

  tasks.forEach((task) => {
    tasksByStatus[task.status].push(task);
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    dispatch(
      moveTask({
        taskId: Number(draggableId),
        newStatus: destination.droppableId as Task["status"],
      })
    );
  };

  const handleUpdateTask = () => {
    if (editingTask) {
      const updatedTask = {
        title: updatedTitle,
        description: updatedDescription,
      };
      dispatch(updateTaskAsync({ taskId: editingTask.id, updatedTask }));
      setEditingTask(null);
      setUpdatedTitle("");
      setUpdatedDescription("");
    }
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTaskAsync(taskId));
  };

  if (loading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4 md:p-6 mt-1 h-screen overflow-y-auto w-full">
        <p className="text-center text-2xl font-bold text-yellow-300 mb-6">Tasks Board</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 overflow-hidden">
          {Object.entries(tasksByStatus).map(([status, taskList]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md min-h-[300px] flex flex-col"
                >
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                    {status}
                  </h3>

                  {taskList.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4 shadow-md transition-all"
                        >
                          <h2 className="font-semibold text-gray-900 dark:text-white text-md mb-1">
                            {task.title}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {task.description}
                          </p>
                          <div className={`text-xs font-medium inline-block px-2 py-1 rounded ${statusColors[task.status]}`}>
                            {task.status}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.assignees.map((person, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                              >
                                {person}
                              </span>
                            ))}
                          </div>

                          {/* Edit and Delete Buttons */}
                          <div className="mt-3 flex gap-2">
                            <button
                              className="bg-yellow-500 text-sm text-gray-600 hover:text-yellow-400 px-2 py-1 rounded"
                              onClick={() => {
                                setEditingTask(task);
                                setUpdatedTitle(task.title);
                                setUpdatedDescription(task.description);
                              }}
                            >
                              ✍️
                            </button>
                            <button
                              className="bg-red-500 px-2 py-1 rounded  text-gray-600 hover:text-red-400"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  {taskList.length === 0 && (
                    <p className="text-sm text-gray-400 mt-4 text-center">
                      No tasks in this column
                    </p>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>

      {/* Update Modal */}
      {editingTask && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-20 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-grey">Edit Task</h2>
            <input
              type="text"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Task Title"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <textarea
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Task Description"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateTask}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  );
};

export default TaskList;
