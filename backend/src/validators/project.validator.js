import { body } from "express-validator";

export const projectValidator = [
  body("name").notEmpty().withMessage("Project name is required"),
  body("description").optional().isString(),
  body("members").optional().isArray().withMessage("Members must be an array")
];