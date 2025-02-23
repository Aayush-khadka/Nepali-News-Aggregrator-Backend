import { Router } from "express";
import {
  signupForNewsLetter,
  verify,
  unsubscribeNewsletter,
} from "../controllers/newsletter.controller.js";

const router = Router();

router.route("/signup").post(signupForNewsLetter);
router.route("/unsubscribe").post(unsubscribeNewsletter);
router.route("/verify").get(verify);

export default router;
