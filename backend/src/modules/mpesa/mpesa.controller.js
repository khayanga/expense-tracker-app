import axios from "axios";
import { getMpesaToken } from "../../lib/utils/mpesa.js";
import db from "../../lib/prisma.js";
import { applyRatioAllocation } from "../wallet/wallet.service.js";

export const initiateTopUp = async (req, res) => {
  try {
    const { user_id, amount, phone } = req.body;

    if (!user_id || !amount || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure wallet exists
    const wallet = await db.wallet.upsert({
      where: { user_id },
      update: {},
      create: { user_id },
    });

    const token = await getMpesaToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: "WalletTopUp",
      TransactionDesc: "Wallet Top-up",
    };

    // console.log("STK Push payload:", payload);

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("STK Push response:", response.data);

    const checkoutRequestId = response.data.CheckoutRequestID;
    if (!checkoutRequestId) {
      throw new Error("No CheckoutRequestID returned");
    }

    // Create pending wallet transaction
    await db.walletTransaction.create({
      data: {
        wallet_id: wallet.id,
        user_id,
        amount,
        type: "topup",
        direction: "credit",
        status: "pending",
        reference: checkoutRequestId,
        method: "mpesa",
      },
    });

    res.json({
      success: true,
      message: "STK Push initiated",
      checkoutRequestId,
    });
  } catch (error) {
    console.error("STK Push error:", error);
    res.status(500).json({ success: false });
  }
};

export const mpesaCallback = async (req, res) => {
  try {
    const stkCallback = req.body?.Body?.stkCallback;

    if (!stkCallback) {
      return res.status(400).send("Invalid callback");
    }
    console.log("📩 MPESA CALLBACK:", JSON.stringify(req.body, null, 2));

    const reference = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    const walletTx = await db.walletTransaction.findFirst({
      where: { reference },
    });

    if (!walletTx) {
      return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (resultCode === 0) {
      const metadata = stkCallback.CallbackMetadata?.Item || [];
      const amount =
        metadata.find((i) => i.Name === "Amount")?.Value ?? walletTx.amount;

      await db.$transaction(async (tx) => {
        await tx.walletTransaction.update({
          where: { id: walletTx.id },
          data: { status: "completed" },
        });

        await tx.wallet.update({
          where: { id: walletTx.wallet_id },
          data: { balance: { increment: Number(amount) } },
        });
      });

      await applyRatioAllocation(walletTx.id);

      console.log("✅ Wallet top-up completed:", walletTx.id);
    } else {
      await db.walletTransaction.update({
        where: { id: walletTx.id },
        data: { status: "failed" },
      });
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("Callback error:", error);

    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
};
