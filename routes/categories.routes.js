import { Router } from "express";
import {
  getArtAndCulture,
  getBusiness,
  getClimateAndEnviroment,
  getHealth,
  getInvestigations,
  getNational,
  getOpinion,
  getPolitics,
  getScienceAndTech,
  getSociety,
  getSports,
  getWorld,
} from "../controllers/categories.controller.js";

const router = Router();

router.route("/politics").get(getPolitics);
router.route("/business").get(getBusiness);
router.route("/national").get(getNational);
router.route("/sports").get(getSports);
router.route("/society").get(getSociety);
router.route("/science-tech").get(getScienceAndTech);
router.route("/opinion").get(getOpinion);
router.route("/health").get(getHealth);
router.route("/world").get(getWorld);
router.route("/art-culture").get(getArtAndCulture);
router.route("/climate-enviroment").get(getClimateAndEnviroment);
router.route("/investigations").get(getInvestigations);

export default router;
