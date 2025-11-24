import db from "../lib/prisma.js";

export async function createTransaction(req, res) {
  const { user_id, amount, category, title, type } = req.body;

  try {
    if (!user_id || !amount || !category || !title || !type) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedAmount =
      title === "expense" ? -Math.abs(amount) : Math.abs(amount);

    const transaction = await db.transaction.create({
      data: { user_id, amount: normalizedAmount, category, title, type },
    });

    if (type === "income") {
      const ratio = await db.userRatio.findUnique({
        where: { user_id },
      });

      if (ratio) {
        const allocations = [
          {
            user_id,
            amount: (amount * ratio.needs_percent) / 100,
            category: "Needs",
            title: "Needs Allocation",
            type: "allocation",
            parent_id: transaction.id,
          },
          {
            user_id,
            amount: (amount * ratio.wants_percent) / 100,
            category: "Wants",
            title: "Wants Allocation",
            type: "allocation",
            parent_id: transaction.id,
          },
          {
            user_id,
            amount: (amount * ratio.savings_percent) / 100,
            category: "Savings",
            title: "Savings Allocation",
            type: "allocation",
            parent_id: transaction.id,
          },
        ];

        await db.transaction.createMany({ data: allocations });
      }
    }

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
      where: { 
        user_id,
        parent_id:null ,
        type: { in: ["income", "expense"] },

      },
      orderBy: {
        created_at: 'desc'
      },
      
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


export async function getAlloctionsByTransactionId(req,res) {

  const {id} =req.params;

  try {
    const allocations = await db.transaction.findMany({
      where:{
        parent_id:Number(id)
      },
    })

    res.status(201).json({
      success:true,
      data:allocations
    })
    
  } catch (error) {
    console.error("Error fetching allocations", error)
    res.status(500).json({
      success:false,
      message:"Failed to fetch allocations"
    })
  }
  
}

export async function getLatestIncomeAllocations(req, res) {
  const { user_id } = req.params;

  try {
   
    const latestIncome = await db.transaction.findFirst({
      where: {
        user_id,
        type: "income",
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!latestIncome) {
      return res.status(404).json({
        success: false,
        message: "No income transactions found for this user",
      });
    }

    
    const allocations = await db.transaction.findMany({
      where: {
        parent_id:latestIncome.id
      },
    });

    res.status(200).json({
      success: true,
      data: {
        income: latestIncome,
        allocations,
      },
    });
  } catch (error) {
    console.error("Error fetching latest income allocations", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest income allocations",
    });
  }
}


export async function updateTransaction(req, res) {
  const { id } = req.params;
  const { amount, category, title, type } = req.body;
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
      data: { amount, category, title, type },
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
    const { user_id } = req.params;
    const transactions = await db.transaction.findMany({
      where: { user_id },
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

export async function getWalletSummary(req, res) {
  try {
    const { user_id } = req.params;

    
    const walletTransactions = await db.walletTransaction.findMany({
      where: { 
        wallet: { user_id }, 
        status: "completed"
      },
    });


    const totalTopUps = walletTransactions
      .reduce((sum, t) => sum + Number(t.amount), 0);

    
    const expensesTransactions = await db.transaction.findMany({
      where: { user_id, type: "expense" },
    });

    const totalExpenses = expensesTransactions
      .reduce((sum, t) => sum + Number(t.amount), 0);

    
    const balance = totalTopUps - totalExpenses;

    
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
        income: formatKES(totalTopUps),
        expenses: `-${formatKES(totalExpenses)}`,
        balance: formatKES(balance),
      },
    });

  } catch (error) {
    console.error("Error getting the summary:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}



