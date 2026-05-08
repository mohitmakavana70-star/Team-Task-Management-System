import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} from "../controllers/project.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { projectValidator } from "../validators/project.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", protect, getProjects);

router.post(
  "/",
  protect,
  allowRoles("Admin"),
  projectValidator,
  validate,
  createProject
);

router.put(
  "/:id",
  protect,
  allowRoles("Admin"),
  projectValidator,
  validate,
  updateProject
);

router.delete("/:id", protect, allowRoles("Admin"), deleteProject);

export default router;