import db from "../../lib/prisma.js";
import * as repository from "./wallet.repository.js";

/**
 * Fetch transactions
 */
export const fetchTransactions = async (userId) => {
  return repository.getWalletTransactionsByUser(userId);
};

export const fetchTransactionById = async (id) => {
  return repository.getWalletTransactionById(id);
};

export const fetchWalletSummary = async (userId) => {
  return repository.getWalletSummaryByUser(userId);
};



export const applyRatioAllocation = async (walletTxId) => {
  const walletTx = await db.walletTransaction.findUnique({
    where: { id: walletTxId },
  });

  if (!walletTx) throw new Error("Wallet transaction not found");

  const amount = Number(walletTx.amount); 

  const wallet = await db.wallet.findUnique({
    where: { id: walletTx.wallet_id },
  });
  if (!wallet) throw new Error("Wallet not found");

  const ratio = await db.userRatio.findUnique({
    where: { user_id: walletTx.user_id },
  });
  if (!ratio) throw new Error("User ratio not found");

  const needs = (amount * ratio.needs_percent) / 100;
  const wants = (amount * ratio.wants_percent) / 100;
  const savings = (amount * ratio.savings_percent) / 100;

  await db.$transaction([
    db.wallet.update({
      where: { id: wallet.id },
      data: {
        needs_balance: { increment: needs },
        wants_balance: { increment: wants },
        savings_balance: { increment: savings },
      },
    }),
    db.walletTransaction.createMany({
      data: [
        {
          wallet_id: wallet.id,
          user_id: walletTx.user_id,
          amount: needs,
          type: "allocation",
          direction: "credit",
          bucket: "needs",
          reference: walletTx.reference,
          status: "completed",
        },
        {
          wallet_id: wallet.id,
          user_id: walletTx.user_id,
          amount: wants,
          type: "allocation",
          direction: "credit",
          bucket: "wants",
          reference: walletTx.reference,
          status: "completed",
        },
        {
          wallet_id: wallet.id,
          user_id: walletTx.user_id,
          amount: savings,
          type: "allocation",
          direction: "credit",
          bucket: "savings",
          reference: walletTx.reference,
          status: "completed",
        },
      ],
    }),
  ]);
};




export const createExpense = async ({ user_id, amount, category, bucket }) => {
  const wallet = await db.wallet.findUnique({ where: { user_id } });
  if (!wallet) throw new Error("Wallet not found");

  
  let expenseBucket = bucket;
  if (!expenseBucket) {
    const needsCategories = ["food", "rent", "utilities", "clothing"];
    const wantsCategories = ["entertainment", "shopping", "subscriptions"];
    if (needsCategories.includes(category.toLowerCase())) expenseBucket = "needs";
    else expenseBucket = "wants";
  }

  
  const bucketBalance = expenseBucket === "needs" ? wallet.needs_balance : wallet.wants_balance;
  if (Number(amount) > Number(bucketBalance)) {
    throw new Error(`Insufficient ${expenseBucket} balance`);
  }

  let expenseTx;
  await db.$transaction(async (tx) => {
  
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: Number(amount) },
        needs_balance: expenseBucket === "needs" ? { decrement: Number(amount) } : undefined,
        wants_balance: expenseBucket === "wants" ? { decrement: Number(amount) } : undefined,
      },
    });

    
    expenseTx = await tx.walletTransaction.create({
      data: {
        wallet_id: wallet.id,
        user_id,
        amount: Number(amount),
        type: "expense",
        direction: "debit",
        bucket: expenseBucket,
        category,
        status: "completed",
      },
    });
  });

  return expenseTx;
};
