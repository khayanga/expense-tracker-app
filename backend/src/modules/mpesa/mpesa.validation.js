
import Joi from "joi";

export const stkPushSchema = Joi.object({
  amount: Joi.number().positive().required(),
  phoneNumber: Joi.string()
    .pattern(/^254\d{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be in the format 2547XXXXXXXX",
    }),
});