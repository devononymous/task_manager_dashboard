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

  const { fields: assigneeFields, append: appendAssignee, remove: removeAssignee } = useFieldArray({
    control,
    name: "assignees",
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags",
  });

  const onSubmit = (data: TaskFormSchema) => {
    const newTask = {
      id: Date.now(),
      createdAt: new Date(),
      ...data,
      dueDate: new Date(data.dueDate),
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
  className="flex flex-col w-full max-w-screen-md p-4 sm:p-6 m-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl mx-auto lg:mx-0"
>
  <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
    📝 Create Task
  </h2>

  {/* Title */}
  <div className="flex flex-col mb-2">
    <label className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Title</label>
    <input
      {...register("title")}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
      placeholder="Task title"
    />
    {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>}
  </div>

  {/* Description */}
  <div className="flex flex-col mb-6 mt-3">
    <label className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Description</label>
    <textarea
      {...register("description")}
      rows={3}
      placeholder="Task details"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
    />
    {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>}
  </div>

  {/* Status & Priority */}
  <div className="flex flex-col md:flex-row gap-4 mb-6">
    <div className="flex flex-col flex-1">
      <label className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Status</label>
      <select
        {...register("status")}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        {["To Do", "In Progress", "Completed", "Blocked"].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>

    <div className="flex flex-col flex-1">
      <label className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Priority</label>
      <select
        {...register("priority")}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        {["Low", "Medium", "High", "Urgent"].map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Due Date */}
  <div className="flex flex-col mb-6">
    <label className="mb-1 font-semibold text-gray-700 dark:text-gray-300">Due Date</label>
    <input
      type="date"
      {...register("dueDate")}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
    />
    {errors.dueDate && <span className="text-red-500 text-sm mt-1">{errors.dueDate.message}</span>}
  </div>

  {/* Assignees */}
  <div className="flex flex-col mb-2 gap-2">
    {assigneeFields.map((field, index) => (
      <div key={field.id} className="flex items-center gap-2">
        <input
          {...register(`assignees.${index}.name`)}
          placeholder="Name"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none"
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
      className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline self-start"
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
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white outline-none"
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
      className="text-green-600 dark:text-green-400 text-sm hover:underline self-start"
    >
      ➕ Add Tag
    </button>
  </div>

  {/* Submit */}
  <div className="flex justify-center">
    <button
      type="submit"
      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-300 shadow-md"
    >
      🚀 Submit Task
    </button>
  </div>
</form>

  );
};

export default TaskForm;
