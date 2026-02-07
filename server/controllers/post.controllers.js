import Post from "../models/Post.model.js";
import mongoose from "mongoose";
import Application from "../models/application.model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import asyncHandler from "express-async-handler";

export const createPost = async (req, res) => {
    try {
        if (req.user.role !== "professor") {
            return res
              .status(403)
              .json({ message: "Only professors can create posts" });
          }
      const {
        title,
        description,
        mode,
        duration,
        stipend,
        skillsRequired,
        applyBy,       
      } = req.body;
  
      if (!title || !description || !mode || !duration || !applyBy) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      if (new Date(applyBy) < new Date()) {
        return res.status(400).json({ message: "Apply date must be in future" })
      }
      
      
    let postImage;

    // ✅ CORRECT: upload.single → req.file
    if (req.file) {
      postImage = await uploadOnCloudinary(req.file.path); 
    }
  
      const post = await Post.create({
        title,
        description,
        mode,
        duration,
        stipend,
        skillsRequired,
        applyBy,
        status: 'open',
        postedBy: req.user._id,
        applicants: [],
        ...(postImage && { postImage }),
      });
  
      res.status(201).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
 
export const getAllPosts = async(req,res) =>{
    try {
        const posts = await Post.find()
    .populate("postedBy", "fullName title role profileImage")
    .sort({ createdAt: -1 });
    
    const now = new Date();

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (post.status === "open" && post.applyBy < now) {
          post.status = "closed";
          await post.save();
        }
        return post;
      })
    );

    res.status(200).json(updatedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPostById = async(req,res) =>{
  try {
    const { id: postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(postId)
      .populate("postedBy", "fullName role profileImage");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const editPost = async (req, res) => {
  try {
    if (req.user.role !== "professor") {
      return res.status(403).json({
        message: "Only professors can edit posts",
      });
    }

    const { id: postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can edit only your own posts",
      });
    }

    const {
      title,
      description,
      mode,
      duration,
      stipend,
      skillsRequired,
      applyBy,
      postImage: imageFromBody, // ⭐ URL case
    } = req.body;

    /* ---------- SKILLS ---------- */
    let newSkills = [];

    if (Array.isArray(skillsRequired)) {
      newSkills = skillsRequired;
    } else if (typeof skillsRequired === "string") {
      newSkills = skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (!newSkills.length) {
      return res.status(400).json({
        message: "skillsRequired is compulsory",
      });
    }

    /* ---------- IMAGE ---------- */
    let finalImage = post.postImage;

    // CASE 1: new file uploaded
    if (req.files?.postImage?.[0]) {
      finalImage = await uploadOnCloudinary(
        req.files.postImage[0].path
      );
    }
    

    // CASE 2: image URL sent from frontend
    else if (typeof imageFromBody === "string" && imageFromBody.trim() !== "") {
      finalImage = imageFromBody;
    }

    /* ---------- UPDATE ---------- */
    const updateData = {
      title,
      description,
      mode,
      duration,
      stipend,
      applyBy,
      skillsRequired: newSkills,
      postImage: finalImage, // ✅ always set
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deletePost = async(req,res) => {
    try {
 
        if (req.user.role !== "professor") {
          return res.status(403).json({
            message: "Only professors can delete posts",
          });
        }
    
        const { id: postId } = req.params;
    
        if (!mongoose.isValidObjectId(postId)) {
          return res.status(400).json({ message: "Invalid post id" });
        }
    
    
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
    
        if (post.postedBy.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            message: "You can delete only your own posts",
          });
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({message: "Post deleted successfully."})

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyPosts = async(req,res) =>{
    try {
      if (req.user.role !== "professor") {
        return res
          .status(403)
          .json({ message: "Only professors can access this resource" });
      }

      const professorId = req.user._id;

    const posts = await Post.find({ 
      postedBy: professorId 
    })
      .sort({ createdAt: -1 });
      res.status(200).json(posts)

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
}

export const getApplicantsByPostId = async (req, res) => {
  try {
    if (req.user.role !== "professor") {
      return res
        .status(403)
        .json({ message: "Only professors can access this resource" });
    }

    const professorId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findOne({
      _id: postId,
      postedBy: professorId,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized access" });
    }

    const applicants = await Application.find({ post:postId })
    .populate("student", "fullName email")
    .populate("post", "title");

    res.status(200).json(applicants);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const applyForPost = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can apply for posts" });
    }

    const studentId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.status !== "open") {
      return res
        .status(403)
        .json({ message: "Applications for this post are closed" });
    }

    const alreadyApplied = await Application.findOne({
      student: studentId,
      post: postId,
    });

    if (alreadyApplied) {
      return res
        .status(409)
        .json({ message: "You have already applied for this post" });
    }

   
    
    if (!req.file) {
      return res.status(400).json({ message: "Resume file required" });
    }

    const resumeUrl = await uploadOnCloudinary(req.file.path, {
      folder: "resumes",
      resource_type: "raw",
      access_mode: "public",
    });


if (!resumeUrl) {
  return res
    .status(500)
    .json({ message: "Resume upload failed" });
}

       

    const newApplication = await Application.create({
      student: studentId,
      post: postId,
      resume: resumeUrl  
     });

     post.applicants.push(newApplication._id);
     await post.save();
 

    return res.status(201).json({
      newApplication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const searchPosts = async (req, res) => {
  try {
    const { search, mode, location } = req.query;  // Multi-filter

    let query = { status: 'open' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { skillsRequired: { $in: [new RegExp(search, 'i')] } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (mode) query.mode = mode;
    if (location) query.location = location;

    const posts = await Post.find(query)
      .populate('postedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(24);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};


