import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
 
  mode: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    required: true
  },

  duration: {
    type: String,
    required: true
  },

  stipend: {
    type: Number,
    default: 0
  },

  skillsRequired: [
    {
      type: String,
      trim: true
    }],

  applyBy: {
    type: Date,
    required: true
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  postImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }

}, { timestamps: true });

const Post =  mongoose.models.Post || mongoose.model('Post',PostSchema)

export default Post
