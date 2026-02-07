import express from "express";
import {
  getPostPerformance} from "../controllers/analysis.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/posts", protectRoute, getPostPerformance);

export default router;
