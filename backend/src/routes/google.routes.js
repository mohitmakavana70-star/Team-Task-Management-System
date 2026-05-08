import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google-auth-user",
        role: "Member"
      });
    }

    res.json({
      token: generateToken(user._id),
      user
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;