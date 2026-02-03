
import express from 'express';
import { closeCycle, createCycle, getAllCycles, getCycleById, updateCycle, } from './productionCycle.controller.js';

const router = express.Router();

router.post("/:user_id", createCycle);
router.get("/:user_id", getAllCycles);
router.get("/:user_id/:cycle_id", getCycleById);
router.patch("/:user_id/:cycle_id", updateCycle);
router.patch("/:user_id/:cycle_id/close", closeCycle);

export default router;