import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            trim: true
        },
        // image: {
        //     type: String,
        //     required: true,
        //     trim: true
        // },
        image: {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
        quantity: {
            type: Number,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        available: {
            type: Boolean,
            required: true,
            trim: true
        },
        feature: {
            type: Boolean,
            required: true,
            trim: true
        },
        calories: {
            type: Number,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);