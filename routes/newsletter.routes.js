import { Router } from "express";
import {
  signupForNewsLetter,
  verify,
  unsubscribeNewsletter,
  getNewsletters,
} from "../controllers/newsletter.controller.js";

const router = Router();

router.route("/signup").post(signupForNewsLetter);
router.route("/unsubscribe").post(unsubscribeNewsletter);
router.route("/verify").get(verify);
router.route("/newsletter").get(getNewsletters);
export default router;
