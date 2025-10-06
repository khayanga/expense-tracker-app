
import express from 'express';
import { createTransaction, deleteTransaction, getSummary, getTransactionById, getTransactions,  getTransactionsByUserId,  updateTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/user/:user_id", getTransactionsByUserId);
router.get("/id/:id", getTransactionById);
router.patch("/id/:id", updateTransaction);
router.delete("/id/:id", deleteTransaction);
router.get("/summary/:user_id", getSummary);


export default router;