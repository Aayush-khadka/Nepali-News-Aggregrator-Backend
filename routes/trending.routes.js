import { Router } from "express";
import { getTrendingArticles } from "../controllers/trending.controller.js";
const router = Router();

router.route("/").get(getTrendingArticles);

export default router;
