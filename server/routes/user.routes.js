import express from 'express'
import { deleteAccount, getUserProfile, getUserProfileById, updateProfile} from '../controllers/user.controllers.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.js'

const router = express.Router()

router.get('/profile',protectRoute,getUserProfile)
router.put('/update-profile',protectRoute,upload.single("profileImage"),updateProfile)
router.get('/profile/:id',protectRoute,getUserProfileById)
router.delete('/delete',protectRoute,deleteAccount)

export default router