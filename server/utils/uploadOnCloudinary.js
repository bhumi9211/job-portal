import { cloudinary } from "../index.js";

const uploadOnCloudinary = async (fileBuffer, fileName) => {
  if (!fileBuffer) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // detect automatically image/video/raw
        public_id: fileName?.split(".")[0],
        folder: "job-posts",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer); // send buffer to cloudinary
  });
};

export default uploadOnCloudinary;
