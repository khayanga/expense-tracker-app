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
        console.log("Transaction fetched successfully");
    }
    catch(error){
        console.error("Error fetching transaction", error);
        res.status(500).json({error:"Internal server error"})
    }
    
}