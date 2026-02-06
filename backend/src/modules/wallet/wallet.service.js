import db from "../../lib/prisma.js";
export const getWalletByUserId = async (userId, tx = db) => {
  const wallet = await tx.wallet.findUnique({
    where: { user_id: userId }
  });

  if (!wallet) throw new Error("Wallet not found");

  return wallet;
};

export const getWalletBalance = async (userId) => {
  const wallet = await getWalletByUserId(userId);
  return wallet.balance;
};

export const getTransactions = async (userId) => {
  return await db.walletTransaction.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" }
  });
};

export const debitWallet = async (userId, amount, metadata, tx = db) => {
  const wallet = await getWalletByUserId(userId, tx);

  if (Number(wallet.balance) < Number(amount)) {
    throw new Error("Insufficient wallet balance");
  }

  const updatedWallet = await tx.wallet.update({
    where: { user_id: userId },
    data: {
      balance: { decrement: amount }
    }
  });

  await tx.walletTransaction.create({
    data: {
      wallet_id: wallet.id,
      user_id: userId,
      amount,
      type: "expense",
      direction: "debit",
      title: metadata.title,
      category: metadata.category,
      reference: metadata.reference,
      stage_id: metadata.stage_id || null,
     cycle_id: metadata.cycle_id || null,
      status: "completed"
    }
  });

  return updatedWallet.balance;
};



export const creditWallet = async (userId, amount, metadata, tx = db) => {
  const wallet = await getWalletByUserId(userId, tx);

  const updatedWallet = await tx.wallet.update({
    where: { user_id: userId },
    data: {
      balance: { increment: amount }
    }
  });

  await tx.walletTransaction.create({
    data: {
      wallet_id: wallet.id,
      user_id: userId,
      amount,
      type: "topup",
      direction: "credit",
      title: metadata.title,
      category: metadata.category,
      reference: metadata.reference,
      status: "completed"
    }
  });

  return updatedWallet.balance;
};

