import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { addTask } from "../app/features/TaskSlice";

const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["To Do", "In Progress", "Completed", "Blocked"]),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  assignees: z.array(z.object({ name: z.string().min(1, "Name is required") })),
  tags: z.array(z.object({ tag: z.string().min(1, "Tag is required") })),
});

type TaskFormSchema = z.infer<typeof TaskSchema>;

const TaskForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormSchema>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
      tags: [],
    },
  });

  const {
    fields: assigneeFields,
    append: appendAssignee,
    remove: removeAssignee,
  } = useFieldArray({
    control,
    name: "assignees",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const onSubmit = (data: TaskFormSchema) => {
    const newTask = {
      id: Date.now(),
      createdAt:new Date().toISOString(),
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
      assignees: data.assignees.map((a) => a.name),
      tags: data.tags.map((t) => t.tag),
      comments: [],
      checklist: [],
    };

    dispatch(addTask(newTask));
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-3xl p-2 rounded-md sm:p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-xl lg:mx-0 transition-all duration-300"
    >
      <h2 className="text-md xs:text-sm sm:text-base md:text-lg font-bold text-center mb-4 text-gray-900 dark:text-white">
        📝 Create Task
      </h2>

      {/* Title */}
      <div className="flex flex-col mb-2">
        <label className="text-sm text-md mb-1 font-semibold text-gray-900 dark:text-white">
          Title
        </label>
        <input
          {...register("title")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Task title"
        />
        {errors.title && (
          <span className="text-red-500 text-sm mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col mb-4 mt-3">
        <label className="mb-1 text-sm text-md font-semibold text-gray-900 dark:text-white">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Task details"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        {errors.description && (
          <span className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Status & Priority */}
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="flex flex-col flex-1">
          <label className="mb-1 text-sm text-md font-semibold text-gray-900 dark:text-white">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-2 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-dark focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {["To Do", "In Progress", "Completed", "Blocked"].map((s) => (
              <option className="text-sm sm:text-base pr-2.5" key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-1">
          <label className="mb-1 text-sm text-md font-semibold text-gray-900 dark:text-white">
            Priority
          </label>
          <select
            {...register("priority")}
            className="w-full px-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {["Low", "Medium", "High", "Urgent"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex flex-col mt-3 mb-4">
        <label className="mb-1 text-sm text-md font-semibold text-gray-900 dark:text-white">
          Due Date
        </label>
        <input
          type="date"
          {...register("dueDate")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        {errors.dueDate && (
          <span className="text-red-500 text-sm mt-1">
            {errors.dueDate.message}
          </span>
        )}
      </div>

      {/* Assignees */}
      <div className="flex flex-col mb-2 gap-2">
        {assigneeFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              {...register(`assignees.${index}.name`)}
              placeholder="Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />
            <button
              type="button"
              onClick={() => removeAssignee(index)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendAssignee({ name: "" })}
          className="text-sm text-md text-indigo-600 dark:text-indigo-400 text-sm hover:underline self-start"
        >
          ➕ Add Assignee
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-col mb-6 gap-2">
        {tagFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              {...register(`tags.${index}.tag`)}
              placeholder="Tag"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendTag({ tag: "" })}
          className="text-sm text-md text-green-600 dark:text-green-400  hover:underline self-start"
        >
          ➕ Add Tag
        </button>
      </div>

      {/* Submit */}
      <div className="flex justify-center ">
        <button
          type="submit"
          className=" text-green-300 text-sm text-md px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg transition duration-500 shadow-md"
        >
          🚀 Submit Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
