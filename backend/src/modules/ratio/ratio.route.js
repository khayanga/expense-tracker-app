import express from "express";
import {
  createRatio,
  deleteUserRatio,
  fetchRatioById,
  updateRatio,
} from "./ratio.controller.js";

const router = express.Router();

router.post("/", createRatio);
router.patch("/:user_id", updateRatio);
router.get("/:user_id", fetchRatioById);
router.delete("/:user_id", deleteUserRatio);

export default router;
