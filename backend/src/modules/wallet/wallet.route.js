import express from "express";
import {
  getTransactions,
  getTransactionById,
  getWalletSummary,
  createExpense,
} from "./wallet.controller.js";

const router = express.Router();

router.get("/user/:user_id", getTransactions);
router.get("/:id", getTransactionById);
router.get("/summary/:user_id", getWalletSummary);
router.post("/expense", createExpense)

export default router;
