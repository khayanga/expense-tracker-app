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
  console.log("🔔 MPesa Callback Received!");
  console.log("📦 Full request body:", JSON.stringify(req.body, null, 2));
  console.log("🔍 Headers:", req.headers);
  
  try {
    const { Body } = req.body;
    const stkCallback = Body?.stkCallback;

    if (!stkCallback) {
      console.error("❌ Invalid callback structure");
      console.log("Available keys:", Object.keys(req.body));
      return res.status(400).send("Invalid callback body");
    }

    console.log("📋 STK Callback details:", {
      CheckoutRequestID: stkCallback.CheckoutRequestID,
      ResultCode: stkCallback.ResultCode,
      ResultDesc: stkCallback.ResultDesc,
      CallbackMetadata: stkCallback.CallbackMetadata
    });

    const reference = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    if (!reference) {
      console.error("❌ Missing CheckoutRequestID");
      return res.status(400).send("No reference provided");
    }

    // Find wallet transaction
    const walletTx = await db.walletTransaction.findFirst({
      where: { reference },
      include: { wallet: true },
    });

    console.log("💾 Database lookup result:", walletTx ? "Found" : "Not found");

    if (!walletTx) {
      console.error("❌ WalletTransaction not found for reference:", reference);
      return res.status(404).send("WalletTransaction not found");
    }

    // Process based on result code
    if (resultCode === 0) {
      console.log("✅ Processing successful transaction");
      
      const amountItem = stkCallback.CallbackMetadata?.Item?.find((i) => i.Name === "Amount");
      const amount = amountItem?.Value || 0;
      const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find((i) => i.Name === "MpesaReceiptNumber")?.Value;

      console.log("💰 Amount:", amount, "Receipt:", mpesaReceipt);

      // Update wallet transaction
      await db.walletTransaction.update({
        where: { id: walletTx.id },
        data: { 
          status: "completed",
          metadata: { mpesaReceipt, ...stkCallback.CallbackMetadata }
        },
      });

      // Update wallet balance
      await db.wallet.update({
        where: { id: walletTx.wallet_id },
        data: { balance: { increment: amount } },
      });

      // Create transaction record
      await db.transaction.create({
        data: {
          user_id: walletTx.wallet.user_id,
          amount,
          category: "Wallet Top-Up",
          title: "Top-up successful",
          type: "income",
          wallet_id: walletTx.wallet.id,
          reference: mpesaReceipt,
        },
      });

      console.log("🎉 MPesa top-up completed successfully");
    } else {
      console.log("❌ Transaction failed:", resultDesc);
      
      await db.walletTransaction.update({
        where: { id: walletTx.id },
        data: {
          status: "failed",
          // failure_reason: resultDesc,
        },
      });
    }

    // IMPORTANT: Send response immediately
    res.status(200).json({ 
      ResultCode: 0, 
      ResultDesc: "Success" 
    });
    
  } catch (error) {
    console.error("🔥 Callback processing error:", error);
    // Still respond successfully to MPesa to avoid retries
    res.status(200).json({ 
      ResultCode: 0, 
      ResultDesc: "Accepted with errors" 
    });
  }
};