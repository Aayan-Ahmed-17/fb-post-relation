import express, { Router } from "express";
import { commentOnPost } from "../controllers/comment.controllers.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = Router();

router.post("/comment", authenticateUser, commentOnPost);

export default router;
