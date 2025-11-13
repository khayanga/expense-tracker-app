
import express from 'express';
import { createTransaction, deleteTransaction, getAlloctionsByTransactionId, getLatestIncomeAllocations, getSummary, getTransactionById, getTransactions,  getTransactionsByUserId,  getWalletSummary,  updateTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/user/:user_id", getTransactionsByUserId);
router.get("/id/:id", getTransactionById);
router.patch("/id/:id", updateTransaction);
router.delete("/id/:id", deleteTransaction);
router.get("/summary/:user_id", getSummary);
router.get("/wallet/summary/:user_id", getWalletSummary)
router.get("/allocations/:id", getAlloctionsByTransactionId)
router.get("/allocations/latest/:user_id", getLatestIncomeAllocations)


export default router;