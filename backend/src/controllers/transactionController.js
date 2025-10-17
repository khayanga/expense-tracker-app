import db from "../lib/prisma.js";

export async function createTransaction(req, res) {
  const { user_id, amount, category, title ,type} = req.body;

  try {
    if (!user_id || !amount || !category || !title ||!type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedAmount =
      title === "expense" ? -Math.abs(amount) : Math.abs(amount);

    const transaction = await db.transaction.create({
      data: { user_id, amount: normalizedAmount, category, title ,type},
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating transaction", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getTransactions(req, res) {
  try {
    const transactions = await db.transaction.findMany();

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getTransactionById(req, res) {
  const { id } = req.params;
  try {
    const transaction = await db.transaction.findUnique({
      where: { id: Number(id) },
    });
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getTransactionsByUserId(req, res) {
  const { user_id } = req.params;
  try {
    const transactions = await db.transaction.findMany({
      where: { user_id },
    });

    res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateTransaction(req, res) {
  const { id } = req.params;
  const { amount, category, title,type } = req.body;
  try {
    const existingTransaction = await db.transaction.findUnique({
      where: { id: Number(id) },
    });
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const updatedTransaction = await db.transaction.update({
      where: { id: Number(id) },
      data: { amount, category, title ,type},
    });

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  const { id } = req.params;

  try {
    const existingTransaction = await db.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const deletedTransaction = await db.transaction.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error) {
    console.error("Error deleting transaction", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getSummary(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await db.transaction.findMany({
      where: { user_id: userId },
    });
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = income - expenses;

    const formatKES = (value) =>
      new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 2,
      }).format(value);

    res.status(200).json({
      success: true,
      message: "Transaction summary fetched successfully",
      data: {
        income: formatKES(income),
        expenses: `-${formatKES(expenses)}`,
        balance: formatKES(balance),
      },
    });
  } catch (error) {
    console.error("Error getting the summary:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
