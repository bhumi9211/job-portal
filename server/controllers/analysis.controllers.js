import Post from "../models/post.model.js";
import Application from "../models/application.model.js";
import mongoose from "mongoose";

export const getPostPerformance = async (req, res) => {
    try {
      if (req.user.role !== "professor") {
        return res.status(403).json({
          message: "Only professors can access this resource",
        });
      }
  
      const professorId = new mongoose.Types.ObjectId(req.user._id);
  
      const postPerformance = await Post.aggregate([
        {
          $match: { postedBy: professorId },
        },
        {
          $lookup: {
            from: "applications",
            localField: "_id",
            foreignField: "post", 
            as: "applications",
          },
        },
        {
          $addFields: {
            applicants: { $size: { $ifNull: ["$applications", []] } }
          }
        },
        {
          $project: {
            title: 1,
            status: 1,
            applicants: 1,
            _id: 1,
          },
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);
  
      // ✅ Calculate OVERALL metrics (same for all posts)
      const totalPosts = postPerformance.length;
      const totalApplicants = postPerformance.reduce((sum, post) => sum + post.applicants, 0);
      const avgApplicantsPerPost = totalPosts > 0 ? totalApplicants / totalPosts : 0;
      const performancePercentage = totalPosts > 0 ? (totalApplicants / totalPosts) * 10 : 0;
  
      // ✅ Calculate ACTIVE post stats
      const activePosts = postPerformance.filter(post => post.status === 'open');
      const closedPosts = postPerformance.filter(post => post.status === 'closed');
      const activePercentage = totalPosts > 0 ? (activePosts.length / totalPosts) * 100 : 0;
  
      // ✅ INDIVIDUAL post performance (NEW!)
      const maxApplicants = Math.max(...postPerformance.map(p => p.applicants));
      const enhancedPosts = postPerformance.map(post => {
        // Individual post performance relative to best post
        const individualPerformance = maxApplicants > 0 
          ? (post.applicants / maxApplicants) * 100 
          : 0;
        
        return {
          ...post,
          // ✅ Overall portfolio stats
          portfolioAvgApplicants: Math.round(avgApplicantsPerPost * 10) / 10,
          portfolioPerformance: Math.round(performancePercentage * 10) / 10,
          // ✅ Individual post performance
          individualPerformance: Math.round(individualPerformance * 10) / 10,
          applicantsRank: post.applicants === maxApplicants ? "⭐ TOP" : post.applicants > 0 ? "✅ Good" : "➖ None"
        };
      });
  
      const response = {
        posts: enhancedPosts,
        summary: {
          totalPosts,
          totalApplicants,
          avgApplicantsPerPost: Math.round(avgApplicantsPerPost * 10) / 10,
          performancePercentage: Math.round(performancePercentage * 10) / 10,
          activePosts: activePosts.length,
          closedPosts: closedPosts.length,
          activePercentage: Math.round(activePercentage * 10) / 10,
          statusBreakdown: {
            open: activePosts.length,
            closed: closedPosts.length,
          },
          topPostApplicants: Math.max(...postPerformance.map(p => p.applicants))
        }
      };
  
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post performance" });
    }
  };
  

  
  