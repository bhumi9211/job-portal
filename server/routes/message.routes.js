import express from 'express'
import { getChatPartners, getMessages, sendMessage,search, getAllChatPartners } from '../controllers/message.controllers.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.js'

const router = express.Router()

router.get("/search",protectRoute ,search)
router.get('/my-chats',protectRoute,getChatPartners)
router.get('/chats',protectRoute,getAllChatPartners)
router.get('/:id',protectRoute,getMessages)
router.post('/send/:id',protectRoute,upload.single("image"),sendMessage)

export default router