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

    
    console.log("📡 Full M-Pesa Response:", JSON.stringify(response.data, null, 2));
    
    const checkoutRequestId = response.data.CheckoutRequestID;
    const merchantRequestId = response.data.MerchantRequestID;
    
    if (!checkoutRequestId) {
      throw new Error("No CheckoutRequestID in M-Pesa response");
    }

    
    await db.walletTransaction.create({
      data: {
        wallet_id: wallet.id,
        amount,
        status: "pending",
        reference: checkoutRequestId, 
        method: "mpesa",
      },
    });

    res.json({ 
      message: "STK Push initiated", 
      data: response.data,
      checkoutRequestId 
    });
  } catch (error) {
    
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
  
  try {
    const { Body } = req.body;
    const stkCallback = Body?.stkCallback;

    if (!stkCallback) {
      console.error("❌ Invalid callback structure");
      return res.status(400).send("Invalid callback body");
    }

    const reference = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    console.log("📋 Processing callback for reference:", reference);

    if (!reference) {
      console.error("❌ Missing CheckoutRequestID");
      return res.status(400).send("No reference provided");
    }

    
    let walletTx = await db.walletTransaction.findFirst({
      where: { reference },
      include: { wallet: true },
    });

    
    if (!walletTx) {
      console.log("⏳ Transaction not found immediately, retrying...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      walletTx = await db.walletTransaction.findFirst({
        where: { reference },
        include: { wallet: true },
      });
    }

    console.log("💾 Database lookup result:", walletTx ? "Found" : "Not found");

    if (!walletTx) {
      console.error("❌ WalletTransaction not found for reference:", reference);
      
      return res.status(200).json({ 
        ResultCode: 0, 
        ResultDesc: "Accepted but transaction not found" 
      });
    }

    
    if (resultCode === 0) {
      console.log("✅ Processing successful transaction");
      
      const callbackMetadata = stkCallback.CallbackMetadata;
      let amount = 0;
      let mpesaReceipt = "Unknown";

      if (callbackMetadata && callbackMetadata.Item) {
        amount = callbackMetadata.Item.find(i => i.Name === "Amount")?.Value || walletTx.amount;
        mpesaReceipt = callbackMetadata.Item.find(i => i.Name === "MpesaReceiptNumber")?.Value || "Unknown";
      }

      console.log("💰 Amount:", amount, "Receipt:", mpesaReceipt);

      
      await db.walletTransaction.update({
        where: { id: walletTx.id },
        data: { 
          status: "completed",
          
        },
      });

      
      const amountDecimal = parseFloat(amount);
      await db.wallet.update({
        where: { id: walletTx.wallet_id },
        data: { balance: { increment: amountDecimal } },
      });

  
      await db.transaction.create({
        data: {
          user_id: walletTx.wallet.user_id,
          amount: amountDecimal,
          category: "Wallet Top-Up",
          title: "Mpesa Top-up ",
          type: "income",
          wallet:{ connect: { id: walletTx.wallet.id } },
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
          
        },
      });
    }

    
    res.status(200).json({ 
      ResultCode: 0, 
      ResultDesc: "Success" 
    });
    
  } catch (error) {
    console.error("🔥 Callback processing error:", error);
    
    res.status(200).json({ 
      ResultCode: 0, 
      ResultDesc: "Accepted with errors" 
    });
  }
};


