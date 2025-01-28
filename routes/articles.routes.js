import { getArticles } from "../controllers/articles.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/get-articles").get(getArticles);

export default router;
