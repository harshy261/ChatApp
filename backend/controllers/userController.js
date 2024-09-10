import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, gender } = req.body;
        console.log("Received registration data:", req.body); // Debugging

        if (!fullName || !userName || !password || !confirmPassword || !gender) {
            console.log("Validation error: Missing fields"); // Debugging
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            console.log("Password mismatch"); // Debugging
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ userName });
        if (user) {
            console.log("Username already exists"); // Debugging
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const maleProfile = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const femaleProfile = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        await User.create({
            fullName,
            userName,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfile : femaleProfile,
            gender
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {
        console.error("Error in register:", error); // Debugging
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        console.log("Received login data:", req.body); // Debugging

        if (!userName || !password) {
            console.log("Validation error: Missing fields"); // Debugging
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ userName });
        if (!user) {
            console.log("User not found"); // Debugging
            return res.status(400).json({ message: "Incorrect username or password", success: false });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("Password does not match"); // Debugging
            return res.status(400).json({ message: "Incorrect username or password", success: false });
        }
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            token // Include token in the response
        });

    } catch (error) {
        console.error("Error in login:", error); // Debugging
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error("Error in logout:", error); // Debugging
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id; // Assuming `req.id` is set by isAuthenticated middleware
        console.log("Fetching other users for:", loggedInUserId); // Debugging
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.error("Error in getOtherUsers:", error); // Debugging
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};
