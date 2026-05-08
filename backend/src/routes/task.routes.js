import express from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  dashboardStats,
  updateTask,
  deleteTask
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { taskValidator } from "../validators/task.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", protect, getTasks);

router.post(
  "/",
  protect,
  allowRoles("Admin"),
  taskValidator,
  validate,
  createTask,
);

router.put(
  "/:id",
  protect,
  allowRoles("Admin"),
  updateTask
);

router.delete(
  "/:id",
  protect,
  allowRoles("Admin"),
  deleteTask
);

router.patch("/:id/status", protect, updateTaskStatus);

router.get("/dashboard/stats", protect, dashboardStats);


export default router;