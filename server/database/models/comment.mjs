import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    assessment: {type: mongoose.Schema.Types.ObjectId, ref: "assessment", required: true},
    body: {type: String, required: true},
}, {
    timestamps: true
})

const commentModel = mongoose.model("Comment", commentSchema, "comments")