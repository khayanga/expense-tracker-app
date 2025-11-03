import express from "express";
import { initiateTopUp, mpesaCallback } from "../controllers/walletController.js";
const router = express.Router();

router.post("/topup", initiateTopUp)
router.post("/callback", mpesaCallback)

export default router;