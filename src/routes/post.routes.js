import express from 'express';
import { createPost, getPost } from '../controllers/post.controllers.js';
import authMiddleware from "../middleware/auth.middleware.js"


const router = express.Router();

router.post('/post', authMiddleware, createPost);
router.get('/post', getPost);

export default router;