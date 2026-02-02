import express from "express";
import { createFarmProfile,getFarmProfile,updateFarmProfile } from "./farmProfile.controller.js";

const router = express.Router();


router.post("/:user_id", createFarmProfile);
router.get("/:user_id", getFarmProfile);
router.patch("/:user_id", updateFarmProfile);

export default router;