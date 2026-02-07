import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { acceptApplication, getWaitlistedCandidatesByPost, hasAlreadyApplied, myApplications, rejectApplication, waitlist, viewResume } from '../controllers/application.controllers.js'

const router = express.Router()

router.get("/:id/already-applied", protectRoute, hasAlreadyApplied);
router.get("/:id/resume",protectRoute,viewResume);
router.get("/my-applications", protectRoute, myApplications);
router.patch("/accept/:id", protectRoute, acceptApplication);
router.patch("/reject/:id", protectRoute, rejectApplication);
router.patch("/waitlist/:id", protectRoute, waitlist);
router.get("/waitlist/post/", protectRoute, getWaitlistedCandidatesByPost);

export default router