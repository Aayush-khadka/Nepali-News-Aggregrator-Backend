import { searchArticles } from "../controllers/search.controller.js";
import { Router } from "express";

const router = Router();

router.route("/").get(searchArticles);

export default router;
