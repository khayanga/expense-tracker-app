
import express from 'express';
import { createTransaction, deleteTransaction, getSummary, getTransactionById, getTransactions,  getTransactionsByUserId,  updateTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.post("/", createTransaction)
router.get("/", getTransactions)
router.get("/:user_id", getTransactionsByUserId)
router.get("/:id", getTransactionById)
router.patch("/:id", updateTransaction)
router.delete("/:id", deleteTransaction)
router.get("/summary/:user_id", getSummary)

export default router;