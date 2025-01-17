import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./src/db/index.js";
import commentRoutes from "./src/routes/comment.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import likeRoutes from "./src/routes/like.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // or whatever your frontend URL is
    credentials: true, // This is important for handling credentials
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", postRoutes);
app.use("/api/v1", likeRoutes);
app.use("/api/v1", commentRoutes);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })
