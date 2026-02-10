import User from "../models/user.model.js";
import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
// import cloudinary from "../config/cloudinary.js";



export const updateProfile = async (req, res) => {
  try {
    const { fullName, gender, location, headline } = req.body;
    const userId = req.user._id;
    let skills, experience, education;
    try {
      if (req.body.skills) {
        skills = JSON.parse(req.body.skills);
      }
      if (req.body.experience) {
        experience = JSON.parse(req.body.experience);
      }
      if (req.body.education) {
        education = JSON.parse(req.body.education);
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid Format.." });
    }
    let profileImageUrl;
    if (req.file) {
      profileImageUrl = await uploadOnCloudinary(
       req.file.buffer, req.file.originalname
      );
    
    }
    const updatedData = {};

    if (fullName) updatedData.fullName = fullName;
    if (gender) updatedData.gender = gender;
    if (location) updatedData.location = location;
    if (headline) updatedData.headline = headline;
    if (skills) updatedData.skills = skills;
    if (experience) updatedData.experience = experience;
    if (education) updatedData.education = education;
    if (profileImageUrl) updatedData.profileImage = profileImageUrl;
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async(req,res) =>{
  try {
    const userId = req.user._id
    if(!userId){
        return res.status(401).json({message: "Unauthorized user.."})
    }
    const profile = await User.findById(userId).select("-password")
    if (!profile) {
        return res.status(404).json({ message: "User not found" })
      }      
    res.status(200).json(profile)
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getUserProfileById = async (req, res) => {
  try {
    
    const { id: userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async(req,res) => {
    try {
      const userId = req.user._id
    await User.findByIdAndDelete(userId)
    res.status(200).json({message: "User deleted successfully"})
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
}

