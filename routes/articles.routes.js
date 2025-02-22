import {
  getArticleCount,
  getLatestArticles,
  getSpecificArticle,
} from "../controllers/articles.controller.js";
import { Router } from "express";

const router = Router();

router.route("/get-latest-articles").get(getLatestArticles);
router.route("/get-article/:id").get(getSpecificArticle);
router.route("/count").get(getArticleCount);

export default router;
