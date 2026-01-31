import express from "express";
import { signupUser, loginUser, deleteUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.delete("/delete", deleteUser);

export default router;
