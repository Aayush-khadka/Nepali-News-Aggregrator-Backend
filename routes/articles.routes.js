import {
  getArticleCount,
  getLatestArticles,
  getSpecificArticle,
} from "../controllers/articles.controller.js";
import { Router } from "express";
import { getTrending } from "../controllers/trending.controller.js";

const router = Router();

router.route("/get-latest-articles").get(getLatestArticles);
router.route("/get-article/:id").get(getSpecificArticle);
router.route("/trending").get(getTrending);
router.route("/count").get(getArticleCount);

export default router;
