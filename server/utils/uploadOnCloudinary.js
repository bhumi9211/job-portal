import {cloudinary} from '../index.js'
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const uploadResult = await cloudinary.uploader.upload(filePath,
      {
        resource_type: "raw",      // default safety
        access_mode: "public",
    });

    fs.unlinkSync(filePath); // cleanup
    return uploadResult.secure_url;
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};

export default uploadOnCloudinary;
