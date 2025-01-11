import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "user id is required"]
        },
        post:{
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: [true, "post id is required"]
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("like", likeSchema)