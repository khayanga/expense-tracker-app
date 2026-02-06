import {
  getWalletByUserId,
  getWalletBalance,
  getTransactions,
  debitWallet,
  creditWallet
} from "./wallet.service.js";


export const getWallet = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const wallet = await getWalletByUserId(userId);
    res.json(wallet);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getBalance = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const balance = await getWalletBalance(userId);
    res.json({ balance });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getWalletTransactions = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const transactions = await getTransactions(userId);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};


export const debit = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { amount, title, category, reference } = req.body;

    const balance = await db.$transaction((tx) =>
      debitWallet(userId, amount, { title, category, reference }, tx)
    );

    res.json({ message: "Wallet debited", balance });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const credit = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { amount, title, category, reference } = req.body;

    const balance = await creditWallet(userId, amount, {
      title,
      category,
      reference
    });

    res.json({
      message: "Wallet credited successfully",
      balance
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
