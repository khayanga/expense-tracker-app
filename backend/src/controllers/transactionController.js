import db from "../lib/prisma.js";


export async function createTransaction(req, res) {
    const { user_id, amount, category, title } = req.body;

  try {
    if (!user_id || !amount || !category || !title) {
        return res.status(400).json({ error: "All fields are required" });
        }
    const transcation = await db.transactions.create({
      data: {
        user_id: user_id,
        amount,
        category,
        title,
      },
    });
    res.status(201).json(transcation);
    console.log("Transaction created successfully");
  } catch (error) {
    console.error("Error creation transaction", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTransactions(req, res) {
    try {

        const transactions = await db.transactions.findMany();

        res.status(200).json(transactions)

        console.log("Transactions fetched successfully");
        
    } catch (error) {
        console.error("Error fetching transactions", error);
        res.status(500).json({error:"Internal server error"})
        
    }
}

export async function getTransactionById(req, res) {
    const {id} = req.params;
    try{
        const transcation= await db.transactions.findUnique({
            where:{id: Number(id)}
        })
        if(!transcation){
            return res.status(404).json({error:"Transaction not found"})
        }
        res.status(200).json(transcation)
        
    }
    catch(error){
        console.error("Error fetching transaction", error);
        res.status(500).json({error:"Internal server error"})
    }
    
}

export async function getTransactionsByUserId(req, res) {
  const { user_id } = req.params;
  try {
    const transactions = await db.transactions.findMany({
      where: { user_id }
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ error: "No transactions found for this user" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function updateTransaction(req, res) {
    const {id} = req.params;
    const {amount, category, title} = req.body;
    try {

      const existingTransaction = await db.transactions.findUnique(
        {where : {id:Number(id)}}
      )
      if(!existingTransaction){
        return res.status(404).json({error:"Transaction not found"})
      }

      const updateTransaction = await db.transactions.update({
        where :{id: Number(id)},
        data:{
          amount,
          category,
          title
        }
      })
      res.status(200).json(updateTransaction)
      
      
    } catch (error) {
      console.error("Error updating transaction", error);
      res.status(500).json({error:"Internal server error"})
      
    }
      
}

export async function deleteTransaction(req, res) {
  const { id } = req.params;

  try {
    const existingTransaction = await db.transactions.findUnique({
      where: { id: Number(id) }
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const deletedTransaction = await db.transactions.delete({
      where: { id: Number(id) }
    });

     res.status(200).json({
      message: "Transaction deleted successfully",
      deletedTransaction
    });
  } catch (error) {
    console.error("Error deleting transaction", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



export async function getSummary(req, res) {
  try {
    const { userId } = req.params;

    
    const balanceAgg = await db.transactions.aggregate({
      _sum: { amount: true },
      where: { user_id: userId },
    });

    
    const incomeAgg = await db.transactions.aggregate({
      _sum: { amount: true },
      where: { user_id: userId, category: "Income" },
    });

    
    const expensesAgg = await db.transactions.aggregate({
      _sum: { amount: true },
      where: { user_id: userId, category: "Expenses" },
    });

    const balance = balanceAgg._sum.amount ? balanceAgg._sum.amount.toNumber() : 0;
    const income = incomeAgg._sum.amount ? incomeAgg._sum.amount.toNumber() : 0;
    const expenses = expensesAgg._sum.amount ? expensesAgg._sum.amount.toNumber() : 0;

    res.status(200).json({
      message: "Transaction summary fetched successfully",
      balance,
      income,
      expenses,
    });
  } catch (error) {
    console.error("Error getting the summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
