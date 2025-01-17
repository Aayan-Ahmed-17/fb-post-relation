import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        post:{
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("comment", commentSchema)