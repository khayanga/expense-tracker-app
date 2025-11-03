import axios from "axios";
import { getMpesaToken } from "../lib/utils/mpesa.js";
import db from "../lib/prisma.js";

export const initiateTopUp = async (req, res) => {
  try {
    const { user_id, amount, phone } = req.body;

    // Validate if all fields exist
    if (!user_id || !amount || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if the wallet exists for the user
    const wallet = await db.wallet.upsert({
      where: { user_id },
      update: {},
      create: { user_id, balance: 0 },
    });

    // Getting an access token from mpesa
    const token = await getMpesaToken();

    // Initiating the STK Push request to mpesa
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

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await db.walletTransaction.create({
      data: {
        wallet_id: wallet.id,
        amount,
        status: "pending",
        reference: response.data.CheckoutRequestID,
        method: "mpesa",
      },
    });

    res.json({ message: "STK Push initiated", data: response.data });
  } catch (error) {
    // Detailed logging for debugging
    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response?.data || error.message);
    } else {
      console.error("Error:", error);
    }
    res.status(500).json({ error: "Failed to initiate top-up", details: error.message });
  }
};

export const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const stkCallback = Body?.stkCallback;

    if (!stkCallback) return res.status(400).send("Invalid callback body");

    const reference = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    if (!reference) return res.status(400).send("No reference provided");

    // Extract amount from callback metadata
    const amount = stkCallback.CallbackMetadata?.Item.find(
      (i) => i.Name === "Amount"
    )?.Value;

    if (!amount) return res.status(400).send("Amount not found in callback");

    // 1️⃣ Find the wallet transaction and include wallet relation
    const walletTx = await db.walletTransaction.findFirst({
      where: { reference },
      include: { wallet: true },
    });

    if (!walletTx) return res.status(404).send("WalletTransaction not found");

    if (resultCode === 0) {
      
      await db.walletTransaction.update({
        where: { id: walletTx.id },
        data: { status: "completed" },
      });

      
      await db.wallet.update({
        where: { id: walletTx.wallet_id },
        data: { balance: { increment: amount } },
      });

      
      await db.transaction.create({
        data: {
          user_id: walletTx.wallet.user_id, 
          amount,
          category: "Wallet Top-Up",
          title: "Top-up successful",
          type: "income",
          wallet_id: walletTx.wallet.id,
        },
      });
    } else {
      
      await db.walletTransaction.update({
        where: { id: walletTx.id },
        data: { status: "failed" },
      });
    }

    res.status(200).json({ message: "Callback processed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Callback error", details: error.message });
}
};
