import db from "../../lib/prisma.js";
import * as repository from "./wallet.repository.js";

const NEEDS_CATEGORIES = [
  "food & drinks",
  "transportation",
  "bills",
  "health",
  "housing",
  "utilities",
  "groceries",
  "clothing",
  "education",
];

const WANTS_CATEGORIES = [
  "shopping",
  "entertainment",
  "other",
  "travel",
  "dining out",
  "subscriptions",
];
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

  // Safety: only allocate for successful top-ups
  if (walletTx.type !== "topup" || walletTx.status !== "completed") {
    return;
  }

  const amount = Number(walletTx.amount);

  const ratio = await db.userRatio.findUnique({
    where: { user_id: walletTx.user_id },
  });
  if (!ratio) throw new Error("User ratio not found");

  const needs = (amount * ratio.needs_percent) / 100;
  const wants = (amount * ratio.wants_percent) / 100;
  const savings = (amount * ratio.savings_percent) / 100;

  await db.wallet.update({
    where: { id: walletTx.wallet_id },
    data: {
      needs_balance: { increment: needs },
      wants_balance: { increment: wants },
      savings_balance: { increment: savings },
    },
  });
};




export const createExpense = async ({ user_id, amount, category, bucket,title }) => {
  if (!bucket) {
    throw new Error("Bucket is required");
  }

  if (bucket === "savings") {
    throw new Error("Savings is locked and cannot be spent");
  }

  const wallet = await db.wallet.findUnique({ where: { user_id } });
  if (!wallet) throw new Error("Wallet not found");

  const normalizedCategory = category.toLowerCase();

  if (
    bucket === "needs" &&
    !NEEDS_CATEGORIES.includes(normalizedCategory)
  ) {
    throw new Error("Invalid category for Needs bucket");
  }

  if (
    bucket === "wants" &&
    !WANTS_CATEGORIES.includes(normalizedCategory)
  ) {
    throw new Error("Invalid category for Wants bucket");
  }

  const bucketBalance =
    bucket === "needs"
      ? wallet.needs_balance
      : wallet.wants_balance;

  if (Number(amount) > Number(bucketBalance)) {
    throw new Error(`Insufficient ${bucket} balance`);
  }

  return await db.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: Number(amount) },
        ...(bucket === "needs" && {
          needs_balance: { decrement: Number(amount) },
        }),
        ...(bucket === "wants" && {
          wants_balance: { decrement: Number(amount) },
        }),
      },
    });

    return await tx.walletTransaction.create({
      data: {
        wallet_id: wallet.id,
        user_id,
        amount: Number(amount),
        type: "expense",
        direction: "debit",
        bucket,
        title,
        category,
        status: "completed",
      },
    });
  });
};
