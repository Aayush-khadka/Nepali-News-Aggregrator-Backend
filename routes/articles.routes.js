import {
  getArticles,
  getSpecificArticle,
} from "../controllers/articles.controller.js";
import { Router } from "express";

const router = Router();

router.route("/get-articles").get(getArticles);
router.route("/get-article/:id").get(getSpecificArticle);

export default router;
