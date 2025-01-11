import express from "express";
import {
  loginUser,
  logoutUser,
  regenerateAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";
import authenticateUser from "../middleware/auth.middleware.js";
import User from "../models/users.models.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/generatetoken", regenerateAccessToken);

router.get("/userdata", authenticateUser, async (req, res) => {
  const id = req.userId;
  const user = await User.findById(id);
  res.json({
    message: "you are getting all user detail",
    user,
  });
});

export default router;
