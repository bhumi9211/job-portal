import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    status: {
      type: String,
      enum: ["applied", "pending", "rejected", "withdrawn", "accepted","waitlisted"],
      default: "applied",
    },

    resume: {
      type: String,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Application =  mongoose.model("Application", applicationSchema);
export default Application
