import db from "../../lib/prisma.js";


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
        message: "Percentages must total 100",
      });
    }

    const existing = await db.userRatio.findUnique({
      where: { user_id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User ratio already exists",
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
      data: ratio,
    });
  } catch (error) {
    console.error("Create ratio error:", error);
    res.status(500).json({ success: false });
  }
}


export async function updateRatio(req, res) {
  const { user_id } = req.params;
  const { needsPercent, wantsPercent, savingsPercent } = req.body;

  try {
    const existing = await db.userRatio.findUnique({
      where: { user_id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "User ratio not found",
      });
    }

    const total =
      (needsPercent ?? existing.needs_percent) +
      (wantsPercent ?? existing.wants_percent) +
      (savingsPercent ?? existing.savings_percent);

    if (total !== 100) {
      return res.status(400).json({
        success: false,
        message: "Percentages must total 100",
      });
    }

    const updated = await db.userRatio.update({
      where: { user_id },
      data: {
        needs_percent: needsPercent,
        wants_percent: wantsPercent,
        savings_percent: savingsPercent,
      },
    });

    res.json({
      success: true,
      message: "Ratio updated. Will apply to future top-ups.",
      data: updated,
    });
  } catch (error) {
    console.error("Update ratio error:", error);
    res.status(500).json({ success: false });
  }
}
export async function fetchRatioById(req, res) {
  const { user_id } = req.params;

  try {
    const ratio = await db.userRatio.findUnique({
      where: { user_id },
    });

    if (!ratio) {
      return res.status(404).json({
        success: false,
        message: "User ratio not found",
      });
    }

    res.json({
      success: true,
      data: ratio,
    });
  } catch (error) {
    console.error("Fetch ratio error:", error);
    res.status(500).json({ success: false });
  }
}
export async function deleteUserRatio(req, res) {
  const { user_id } = req.params;

  try {
    const existing = await db.userRatio.findUnique({
      where: { user_id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "User ratio not found",
      });
    }

    await db.userRatio.delete({
      where: { user_id },
    });

    res.json({
      success: true,
      message: "User ratio deleted",
    });
  } catch (error) {
    console.error("Delete ratio error:", error);
    res.status(500).json({ success: false });
  }
}
