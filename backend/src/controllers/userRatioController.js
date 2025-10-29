import db from "../lib/prisma.js";

export async function createRatio(req, res) {
  const { user_id, needsPercent, wantsPercent, savingsPercent } = req.body;
  try {
    if (
      !user_id ||
      needsPercent == null ||
      wantsPercent == null ||
      savingsPercent == null
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const total = needsPercent + wantsPercent + savingsPercent;

    if (total !== 100) {
      return res.status(400).json({
        success: false,
        message: "The total percentage should be equal to 100%",
      });
    }

    const existing = await db.userRatio.findUnique({ where: { user_id } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "The ratio alredy exists , you can update to a new one",
      });
    }

    const ratio = await db.userRatio.create({
      data: {
        user_id,
        needs_percent: needsPercent,
        wants_percent: wantsPercent,
        savings_percent: savingsPercent,
      },
    });

    res.status(201).json({
      success: true,
      message: "Ratio created Successfully",
      data: ratio,
    });
  } catch (error) {
    console.error("Error creating ratio", error);
    res.status(500).json({
      success: false,
      message: "Failed to create ratio",
    });
  }
}

export async function updateRatio(req, res) {
  const { user_id } = req.params;
  const { needsPercent, savingsPercent, wantsPercent, transactionId } = req.body;

  try {
    const existingRatio = await db.userRatio.findUnique({ where: { user_id } });
    if (!existingRatio) {
      return res.status(400).json({
        success: false,
        message: "User ratio does not exist",
      });
    }

    const total = (needsPercent ?? 0) + (wantsPercent ?? 0) + (savingsPercent ?? 0);
    if (total !== 100) {
      return res.status(400).json({
        success: false,
        message: "The total percentage must equal 100",
      });
    }

    let tx;
    if (transactionId) {
      tx = await db.transaction.findUnique({ where: { id: Number(transactionId) } });
    } else {
      tx = await db.transaction.findFirst({
        where: { user_id, type: "income" },
        orderBy: { created_at: "desc" },
      });
    }

    if (!tx || tx.type !== "income") {
      return res.status(400).json({
        success: false,
        message: "No valid income transaction found",
      });
    }

    const updatedRatio = await db.userRatio.update({
      where: { user_id },
      data: {
        needs_percent: needsPercent,
        wants_percent: wantsPercent,
        savings_percent: savingsPercent,
      },
    });

    await db.transaction.deleteMany({
      where: { parent_id: tx.id, type: "allocation" },
    });

    const allocations = [
      {
        user_id,
        amount: Number(((tx.amount * needsPercent) / 100).toFixed(2)),
        category: "Needs",
        title: "Needs Allocation",
        type: "allocation",
        parent_id: tx.id,
      },
      {
        user_id,
        amount: Number(((tx.amount * wantsPercent) / 100).toFixed(2)),
        category: "Wants",
        title: "Wants Allocation",
        type: "allocation",
        parent_id: tx.id,
      },
      {
        user_id,
        amount: Number(((tx.amount * savingsPercent) / 100).toFixed(2)),
        category: "Savings",
        title: "Savings Allocation",
        type: "allocation",
        parent_id: tx.id,
      },
    ];

    await db.transaction.createMany({ data: allocations });

    const newAllocations = await db.transaction.findMany({
      where: { parent_id: tx.id, type: "allocation" },
    });

    res.status(201).json({
      success: true,
      message: "Ratio and allocations updated successfully",
      data: {
        updatedRatio,
        newAllocations,
      },
    });
  } catch (error) {
    console.error("Error updating the ratio", error);
    res.status(500).json({
      success: false,
      message: "Could not update ratio",
    });
  }
}

export async function fetchRatioById(req,res) {
    const{user_id}=req.params;
    try {

        const ratio = await db.userRatio.findUnique({
            where:{user_id}
        })

        if(!ratio){
            return res.status(400).json({
                success:false,
                message:"User ratio doesn't exist"
            })
        }

        res.status(200).json({
            success:true,
            message:"Ratio fetched succesfully",
            data:ratio,
        })
        
    } catch (error) {
        console.error("Error fetchig ratio", error )
        res.status(500).json({
            success:false,
            message:"Ratio could not be fetched"
        })
    }
    
}

export async function deleteUserRatio(req, res) {
  const { userId } = req.params;

  try {
    const existingRatio = await db.userRatio.findUnique({
      where: { userId },
    });

    if (!existingRatio) {
      return res.status(404).json({
        success: false,
        message: "User ratio not found",
      });
    }

    const deleted = await db.userRatio.delete({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: "User ratio deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting user ratio:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}