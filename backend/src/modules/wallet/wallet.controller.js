import * as service from "./wallet.service.js";

export const getTransactions = async (req, res) => {
  const { user_id } = req.params;

  try {
    const transactions = await service.fetchTransactions(user_id);
    res.status(200).json({
      success: true,
      message: "Wallet transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await service.fetchTransactionById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error("Error fetching wallet transaction:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getWalletSummary = async (req, res) => {
  const { user_id } = req.params;
  try {
    const wallet = await service.fetchWalletSummary(user_id);

    res.status(200).json({
      success: true,
      data: {
        balance: wallet.balance,
        needsBalance: wallet.needs_balance,
        wantsBalance: wallet.wants_balance,
        savingsBalance: wallet.savings_balance,
      },
    });
  } catch (error) {
    console.error("Wallet summary error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const createExpense = async (req, res) => {
  try {
    const { user_id, amount, category, bucket,title} = req.body;

    if (!user_id || !amount || !category || !bucket || !title) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const expense = await service.createExpense({
      user_id,
      amount,
      category,
      bucket,
      title
    });

    res.status(201).json({
      success: true,
      message: `Expense deducted from ${bucket}`,
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
