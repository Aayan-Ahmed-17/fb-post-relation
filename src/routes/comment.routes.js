import express, { Router } from "express";
import { commentOnPost } from "../controllers/comment.controllers.js";
import authenticateUser from "../middleware/middleware.auth.js";

const router = Router();

router.post("/comment", authenticateUser,commentOnPost);

export default router