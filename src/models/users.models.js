import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "firstName is required"],
  },
  lastName: {
    type: String,
    required: [true, "lastName is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

userSchema.pre("save", async function name(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
})

export default mongoose.model("User", userSchema)
