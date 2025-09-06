
import express from 'express';
import { createTransaction, getTransactionById, getTransactions } from '../controllers/transactionController.js';

const router = express.Router();

router.post("/", createTransaction)
router.get("/", getTransactions)
router.get("/:id", getTransactionById)

export default router;