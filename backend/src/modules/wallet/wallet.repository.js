import db from "../../lib/prisma.js";

export const getWalletTransactionsByUser = async (userId) => {
  return db.walletTransaction.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
};

export const getWalletTransactionById = async (id) => {
  return db.walletTransaction.findUnique({
    where: { id: Number(id) },
  });
};


export const getWalletSummaryByUser = async (userId) => {
  const wallet = await db.wallet.findUnique({
    where: { user_id: userId },
    include: {
      transactions: {
        where: { status: "completed" },
      },
    },
  });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const totalTopUps = wallet.transactions
    .filter((t) => t.type === "topup")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = wallet.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const allocations = wallet.transactions
    .filter((t) => t.type === "allocation")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    balance: Number(wallet.balance),
    totalTopUps,
    totalExpenses,
    allocatedAmount: allocations,
  };
};
