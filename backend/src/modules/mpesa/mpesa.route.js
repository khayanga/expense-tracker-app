import express from "express";
import { initiateTopUp, mpesaCallback } from "./mpesa.controller.js";
const router = express.Router();

router.post("/topup", initiateTopUp)
router.post("/callback", mpesaCallback)

export default router;