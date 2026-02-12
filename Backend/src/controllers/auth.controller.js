import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register
export const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "user",
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        next(error);
    }
};

// login (user and admin)
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Account not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            role: user.role,
        });
    } catch (error) {
        next(error);
    }
};

// user and admin logout 
export const logout = (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
};


export const getMe = async (req, res) => {
    try {
        const { id } = req.auth;

        const user = await userModel
            .findById(id)
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const updateMe = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const tokenUserId = req.auth.id;    // JWT ID
//         const { firstName, lastName, email, currentPassword, newPassword } = req.body;

//         // 🔐 Security check
//         if (id !== tokenUserId) {
//             return res.status(403).json({ message: "Unauthorized action" });
//         }

//         const updateData = {
//             firstName,
//             lastName,
//             email,
//         };


//         if (password) {
//             updateData.password = await bcrypt.hash(password, 10);
//         }

//         const user = await userModel.findByIdAndUpdate(
//             id,
//             updateData,
//             { new: true }
//         );

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({
//             message: "Profile updated successfully"
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// };


export const updateMe = async (req, res) => {
    try {
        const { id } = req.params;
        const tokenUserId = req.auth.id;
        const { firstName, lastName, email, currentPassword, newPassword } = req.body;

        if (id !== tokenUserId) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        const user = await userModel.findById(id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
