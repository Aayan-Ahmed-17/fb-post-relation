import express from 'express';
import likePost  from '../controllers/like.controllers.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/like', authMiddleware, likePost);

export default router;