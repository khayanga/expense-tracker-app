import axios from "axios";
import { getMpesaToken } from "../../lib/utils/mpesa.js";
import moment from "moment";      
import { stkPushSchema } from "./mpesa.validation.js";


export const initiateSTKPush = async (phone, amount, reference) => {
  
  const { error, value } = stkPushSchema.validate({
    amount,
    phoneNumber: phone,
  });

  if (error) {
    
    return {
      success: false,
      message: error.details[0].message,
    };
  }

  const formattedPhone = value.phoneNumber; 

  const baseURL =
    process.env.MPESA_ENV === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  const token = await getMpesaToken();
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(
    process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
  ).toString("base64");

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: value.amount,
    PartyA: formattedPhone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: reference,
    TransactionDesc: "Centi Wallet Topup",
  };

  return axios.post(`${baseURL}/mpesa/stkpush/v1/processrequest`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
