import db from "../../lib/prisma.js"
const DAILY_RATE = 0.0003;


export const accrueSavingsGrowth = async (user_id) => {
  const account = await db.savingsAccount.findUnique({
    where: { user_id },
  });

  if (!account) return;

  const now = new Date();
  const lastAccrual = new Date(account.last_accrual_at);

  const daysElapsed = Math.floor(
    (now - lastAccrual) / (1000 * 60 * 60 * 24)
  );

  if (daysElapsed <= 0) return;

  const earnings =
    Number(account.principal) * DAILY_RATE * daysElapsed;

  await db.savingsAccount.update({
    where: { user_id },
    data: {
      earnings: { increment: earnings },
      last_accrual_at: now,
    },
  });
};
