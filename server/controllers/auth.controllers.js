import { generateToken } from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(password.length<6){
      return res.status(400).json({message: "Password must contain more than 6 characters.."})
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(402).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashPassword,
      role,
    });
    if (newUser) {
      const token = await generateToken(newUser._id, res);
      return res
        .status(201)
        .json({ message: "New user created successfully", newUser, token });
    } else {
      console.log("Something went wrong");
    }
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await generateToken(user._id, res);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged Out successfully" });
  } catch (error) {
    return res.status(200).json({ message: "User is not logged Out" });
  }
};


