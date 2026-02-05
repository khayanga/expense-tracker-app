import db from "../../lib/prisma.js";

export const createStage = async (cycleId, data) => {
  const cycle = await db.productionCycle.findUnique({
    where: { id: cycleId },
  });

  if (!cycle) {
    throw new Error("Production cycle not found");
  }

  const stage = await db.productionStage.create({
    data: {
      cycle_id: cycleId,
      name: data.name,
      category: data.category,
      planned_cost: data.plannedCost,
      status: data.status,
      start_date: data.startDate,
      due_date: data.dueDate,
    },
  });
  return stage;
};

export const getAllStages = async (cycleId) => {
  return db.productionStage.findMany({
    where: { cycle_id: cycleId },
    orderBy: { created_at: "desc" },
  });
};

export const getStageById = async (cycleId, stageId) => {
  return db.productionStage.findFirst({
    where: { id: stageId, cycle_id: cycleId },
  });
};

export const updateStage = async (stageId, data) => {
  const existingStage = await getStageById(stageId);
  if (!existingStage) {
    throw new Error("Production stage not found");
  }
  if (existingStage.status === "completed") {
    throw new Error("Completed production stages cannot be updated");
  }

  const updatedStage = await db.productionStage.update({
    where: { id: stageId },
    data: {
      name: data.name ?? existingStage.name,
      category: data.category ?? existingStage.category,
      planned_cost: data.plannedCost ?? existingStage.planned_cost,
      status: data.status ?? existingStage.status,
      start_date: data.startDate ?? existingStage.start_date,
      due_date: data.dueDate ?? existingStage.due_date,
    },
  });
  return updatedStage;
};

export const logExpense = async (stageId, amount) => {
  
  const stage = await db.productionStage.findUnique({
    where: { id: stageId },
    include: { cycle: true }
  });

  if (!stage) throw new Error("Production stage not found");
  if (stage.status === "completed") throw new Error("Cannot log expenses");

  const userId = stage.cycle.user_id;

  const wallet = await db.wallet.findUnique({
    where: { user_id: userId },
  });

  if (!wallet) throw new Error("Wallet not found");
  if (Number(wallet.balance) < amount) throw new Error("Insufficient wallet balance");

  
  return db.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { user_id: userId },
      data: { balance: { decrement: amount } }
    });

    await tx.walletTransaction.create({
      data: {
        wallet_id: wallet.id,
        user_id: userId,
        amount,
        title: `Expense for production stage ${stage.name}`,
        type: "expense",
        direction: "debit",
        category: "production_stage",
        reference: `Stage-${stageId}`,
        status: "completed"
      }
    });

    return tx.productionStage.update({
      where: { id: stageId },
      data: { actual_cost: { increment: amount } },
    });
  });
};


export const completeStage = async (stageId) => {
  const existingStage = await getStageById(stageId);
  if (!existingStage) {
    throw new Error("Production stage not found");
  }
  if (existingStage.status === "completed") {
    throw new Error("Production stage is already completed");
  }

  const completedStage = await db.productionStage.update({
    where: { id: stageId },
    data: {
      status: "completed",
    },
  });
  return completedStage;
};
