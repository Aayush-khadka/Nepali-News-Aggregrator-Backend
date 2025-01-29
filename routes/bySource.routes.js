import { Router } from "express";
import {
  getArticlesFromKathmanduPost,
  getArticlesFromRisingNepal,
} from "../controllers/bySource.controller.js";

const router = Router();

router.route("/kathmandu-post").get(getArticlesFromKathmanduPost);
router.route("/rising-nepal").get(getArticlesFromRisingNepal);

export default router;
