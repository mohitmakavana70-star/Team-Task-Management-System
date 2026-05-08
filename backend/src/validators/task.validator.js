import { body } from "express-validator";

export const taskValidator = [
  body("title").notEmpty().withMessage("Task title is required"),
  body("project").notEmpty().withMessage("Project ID is required"),
  body("assignedTo").notEmpty().withMessage("Assigned user ID is required"),
  body("dueDate").notEmpty().withMessage("Due date is required"),
  body("status")
    .optional()
    .isIn(["Todo", "In Progress", "Completed"]),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
];