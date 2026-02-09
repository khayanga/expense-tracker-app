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



export const creditWallet = async (userId, amount, metadata, prisma = db) => {
  
  const wallet = await prisma.wallet.upsert({
    where: { user_id: userId },
    update: {},
    create: { user_id: userId },
  });

  
  if (metadata.reference) {
    const existingTx = await prisma.walletTransaction.findFirst({
      where: { reference: metadata.reference, status: "completed" },
    });

    if (existingTx) {
      return wallet.balance; 
    }
  }

  
  const [updatedWallet] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
      },
    }),

    prisma.walletTransaction.create({
      data: {
        wallet_id: wallet.id,
        user_id: userId,
        amount,
        type: "topup",
        direction: "credit",
        title: metadata.title || "Wallet Credit",
        category: metadata.category || "income",
        reference: metadata.reference || null,
        method: metadata.method || "mpesa",
        stage_id: metadata.stage_id || null,
        cycle_id: metadata.cycle_id || null,
        status: "completed",
      },
    }),
  ]);

  return updatedWallet.balance;
};




export const createPendingTopup = async (userId, amount, reference, phone) => {
  const wallet = await db.wallet.upsert({
    where: { user_id: userId },
    update: {},
    create: { user_id: userId },
  });

  return db.walletTransaction.create({
    data: {
      wallet_id: wallet.id,
      user_id: userId,
      amount,
      type: "topup",
      direction: "credit",
      status: "pending",
      reference,
      method: "mpesa",
      title: "M-Pesa Wallet Top Up",
    },
  });
};

export const completeTopup = async (txId, stkData) => {
  const metadata = stkData.CallbackMetadata?.Item || [];
  const amount = metadata.find(i => i.Name === "Amount")?.Value;

  return db.$transaction(async (tx) => {
    const wtx = await tx.walletTransaction.update({
      where: { id: txId },
      data: { status: "completed" },
    });

    await tx.wallet.update({
      where: { id: wtx.wallet_id },
      data: { balance: { increment: Number(amount) } },
    });
  });
};

export const failTopup = async (txId) => {
  return db.walletTransaction.update({
    where: { id: txId },
    data: { status: "failed" },
  });
};


