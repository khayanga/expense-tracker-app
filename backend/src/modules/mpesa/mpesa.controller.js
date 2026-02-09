import db from "../../lib/prisma.js";
import { stkPushSchema } from "./mpesa.validation.js";
import { initiateSTKPush } from "./mpesa.service.js";
import * as walletService from "../wallet/wallet.service.js";

const formatPhone = (phone) => {
  phone = phone.toString().trim();
  if (phone.startsWith("+")) phone = phone.slice(1);
  if (phone.startsWith("0")) phone = "254" + phone.slice(1);
  return phone;
};
export const requestSTKPush = async (req, res) => {
  try {
    // 1️⃣ Validate request
    const { error, value } = stkPushSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    
    const { phoneNumber, amount } = value;
    const userId = req.params.user_id;
    const formattedPhone = formatPhone(phoneNumber);

    
    const stk = await initiateSTKPush(formattedPhone, amount, userId);

    
    if (!stk.data || !stk.data.CheckoutRequestID) {
      return res.status(400).json({
        success: false,
        message: stk.data?.errorMessage || "Failed to initiate STK Push",
        raw: stk.data,
      });
    }

    const checkoutId = stk.data.CheckoutRequestID;

    
    await walletService.createPendingTopup(userId, amount, checkoutId, formattedPhone);

    res.json({
      success: true,
      message: "STK Push sent successfully",
      checkoutId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const mpesaCallback = async (req, res) => {
  try {
    const stk = req.body.Body.stkCallback;
    const checkoutId = stk.CheckoutRequestID;

    const tx = await db.walletTransaction.findFirst({
      where: { reference: checkoutId },
    });

    if (!tx) return res.json({ ResultCode: 0, ResultDesc: "Accepted" });

    if (stk.ResultCode === 0) {
      await walletService.completeTopup(tx.id, stk);
    } else {
      await walletService.failTopup(tx.id);
    }

    res.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (err) {
    console.error(err);
    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
};

