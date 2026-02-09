import db from "../../lib/prisma.js";
import { debitWallet } from "../wallet/wallet.service.js";

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
    include: { cycle: true },
  });

  if (!stage) throw new Error("Stage not found");

  if (stage.status === "completed") {
    throw new Error(`Cannot log expenses for a completed stage`);
  }

  const userId = stage.cycle.user_id;
  const newActualCost = Number(stage.actual_cost) + Number(amount);
  const updatedStage = await db.$transaction(async (tx) => {
    if (stage.actual_cost > 0) {
      
      await debitWallet(
        userId,
        amount,
        {
          title: `Update expense for production stage: ${stage.name}`,
          category: "production_stage",
          reference: `Stage-${stageId}`,
          stage_id: stage.id,
          cycle_id: stage.cycle_id,
        },
        tx,
      );
    } else {
     
      await debitWallet(
        userId,
        amount,
        {
          title: `Expense for production stage: ${stage.name}`,
          category: "production_stage",
          reference: `Stage-${stageId}`,
          stage_id: stageId,
          cycle_id: stage.cycle_id,
        },
        tx,
      );
    }

    return tx.productionStage.update({
      where: { id: stageId },
      data: {
        actual_cost: { increment: amount },
      },
    });
  });

  if (newActualCost > Number(stage.planned_cost)) {
    return {
      warning: `Actual cost (${newActualCost}) exceeds planned cost (${stage.planned_cost})`,
      stage: updatedStage,
    };
  }

  return { stage: updatedStage };
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
