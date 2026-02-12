import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        role: {
            type: String,
            required: true,
            trim: true,
            default: "user",
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);