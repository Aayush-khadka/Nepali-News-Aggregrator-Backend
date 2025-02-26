import { Router } from "express";
import {
  signupForNewsLetter,
  verify,
  unsubscribeNewsletter,
  getNewsletters,
  sendEmailNewsletter,
} from "../controllers/newsletter.controller.js";

const router = Router();

router.route("/signup").post(signupForNewsLetter);
router.route("/unsubscribe").post(unsubscribeNewsletter);
router.route("/verify").get(verify);
router.route("/newsletter").get(getNewsletters);
router.route("/sendemail").get(sendEmailNewsletter);
export default router;
