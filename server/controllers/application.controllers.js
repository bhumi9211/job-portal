import Application from "../models/application.model.js";
import Post from "../models/post.model.js";
import mongoose from "mongoose";


export const hasAlreadyApplied = async (req, res) => {
    try {
      if (req.user.role !== "student") {
        return res
          .status(403)
          .json({ message: "Only students can access this resource" });
      }
  
      const studentId = req.user._id;
      const { id: postId } = req.params;
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const application = await Application.findOne({
        student: studentId,
        post: postId,
        status: { $ne: "withdrawn" },
      });
  
      return res.status(200).json({
        applied: Boolean(application),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const viewResume = async (req, res) => {
    try {
      const { id } = req.params;
  
      const application = await Application.findById(id)
        .populate({
          path: "post",
          select: "postedBy"
        });
  
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      if (!application.post) {
        return res
          .status(404)
          .json({ message: "Associated post not found" });
      }
  
      // Only professor allowed
      if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access denied" });
      }
  
      // Only post owner allowed
      if (
        application.post.postedBy.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Not your post" });
      }
  
      return res.json({ resume: application.resume });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const myApplications = async (req, res) => {
  try {


    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can access this resource",
      });
    }
    const applications = await Application.find({
      student: req.user._id,
      status: { $ne: "withdrawn" },
    })
      .populate({
        path: "post",
        select: "title company postedBy",
        populate: {
          path: "postedBy",
          select: "fullName email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const acceptApplication = async (req, res) => {
  try {
    if (req.user.role !== "professor") {
      return res.status(403).json({
        message: "Only professors can accept applications",
      });
    }

    const { id : applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const application = await Application.findById(applicationId).populate("post");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to accept this application",
      });
    }

    if (application.status === "accepted") {
      return res.status(400).json({
        message: "Application already accepted",
      });
    }

    application.status = "accepted";
    await application.save();

    // (Optional) Close post after accepting
    // await Post.findByIdAndUpdate(application.post._id, {
    //   status: "closed",
    // });

    res.status(200).json({
      message: "Application accepted successfully",
      application,
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const rejectApplication = async(req,res) =>{
    try {
      if (req.user.role !== "professor") {
        return res
          .status(403)
          .json({ message: "Only professors can accept applications" });
      }
      const { id : applicationId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: "Invalid application id" });
      }
      const application = await Application.findById(applicationId).populate("post");;
      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      if (application.post.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You are not authorized to accept this application",
        });
      }
  
  
      if (application.status === "rejected") {
        return res.status(400).json({
          message: "Application already rejected",
        });
      }
  
      application.status = "rejected";
      await application.save();
  
      // await Post.findByIdAndUpdate(application.post, {
      //   status: "closed",
      // });
      res.status(200).json({message: "Application rejected.."},application)

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
}

export const waitlist = async(req,res) => {
    try {
      if (req.user.role !== "professor") {
        return res
          .status(403)
          .json({ message: "Only professors can accept applications" });
      }
      const { id : applicationId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: "Invalid application id" });
      }
      const application = await Application.findById(applicationId).populate("post");;
      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      if (application.post.postedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You are not authorized to accept this application",
        });
      }

      application.status = "waitlisted";
      await application.save();
  
      // await Post.findByIdAndUpdate(application.post, {
      //   status: "closed",
      // });
      res.status(200).json({message: "Status updated.."},application)

    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
}

export const getWaitlistedCandidatesByPost = async (req, res) => {
  try {
    if (req.user.role !== "professor") {
      return res
        .status(403)
        .json({ message: "Only professors can access this resource" });
    }


    const waitlistedApplications = await Application.find({
      status: "waitlisted",
    })
      .populate("student", "name email profileImage")
      .populate("post", "title");

    res.status(200).json(waitlistedApplications);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
