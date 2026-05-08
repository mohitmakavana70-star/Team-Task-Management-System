import Task from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo,
    status,
    priority,
    dueDate,
    createdBy: req.user._id,
  });

  res.status(201).json(task);
});

export const getTasks = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "Admin"
      ? {}
      : { assignedTo: req.user._id };

  const tasks = await Task.find(filter)
    .populate("project", "name")
    .populate("assignedTo", "name email")
    .sort({ dueDate: 1 });

  res.json(tasks);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  res.json({
    message: "Task deleted"
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (
    req.user.role !== "Admin" &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  task.status = status;
  await task.save();

  res.json(task);
});

export const dashboardStats = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "Admin"
      ? {}
      : { assignedTo: req.user._id };

  const total = await Task.countDocuments(filter);
  const completed = await Task.countDocuments({ ...filter, status: "Completed" });
  const inProgress = await Task.countDocuments({ ...filter, status: "In Progress" });
  const overdue = await Task.countDocuments({
    ...filter,
    status: { $ne: "Completed" },
    dueDate: { $lt: new Date() }
  });

  res.json({
    total,
    completed,
    inProgress,
    overdue
  });
});