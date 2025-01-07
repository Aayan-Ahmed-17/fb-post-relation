import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
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

    }
)

export default mongoose.model("like", likeSchema)