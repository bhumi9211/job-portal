import express from 'express'
import { createPost, deletePost, editPost, getAllPosts, getApplicantsByPostId, getMyPosts, getPostById,applyForPost, searchPosts } from '../controllers/post.controllers.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.js'


const router = express.Router()

router.get("/search", searchPosts)
router.post('/create-post',protectRoute,upload.single("postImage") ,createPost)
router.get('/all-posts',getAllPosts)
router.get('/my-posts',protectRoute,getMyPosts)
router.post("/:id/apply", protectRoute,upload.single("resume"), applyForPost);
router.put('/edit-post/:id',protectRoute,upload.single("postImage"),editPost)
router.delete('/delete/:id',protectRoute,deletePost)
router.get('/:id/applicants',protectRoute,getApplicantsByPostId)
router.get('/:id',getPostById)


export default router