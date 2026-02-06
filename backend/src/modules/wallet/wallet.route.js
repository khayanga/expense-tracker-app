import express from "express";
import { credit, debit, getWallet, getWalletTransactions } from "./wallet.controller.js";


const router = express.Router();

router.get("/:user_id", getWallet);
router.post("/:user_id/topup", credit);
router.post("/:user_id/debit", debit);
router.get("/:user_id/transactions", getWalletTransactions);

export default router;
