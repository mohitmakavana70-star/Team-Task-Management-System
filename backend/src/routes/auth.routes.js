import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import {
  signupValidator,
  loginValidator
} from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);

export default router;