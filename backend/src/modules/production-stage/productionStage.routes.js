import express from "express";
import { completeStage, createStage, getAllStages, getStageById, logExpense, updateStage } from "./productionStage.controller.js";

const router = express.Router();

router.post("/:cycle_id", createStage);
router.get("/:cycle_id", getAllStages);
router.get("/:cycle_id/:id", getStageById);
router.patch("/:cycle_id/:stage_id", updateStage);
router.post("/:cycle_id/:stage_id/expense", logExpense);
router.patch("/:cycle_id/:id/complete", completeStage);
export default router;