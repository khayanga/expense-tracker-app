import Joi from "joi";

export const createProductionCycleSchema = Joi.object({
name: Joi.string().min(2).required(),
  cycleType: Joi.string().valid("crop", "livestock", "mixed").required(),
  startDate: Joi.date().required(),
  expectedEnd: Joi.date().required(),
  status: Joi.string()
  .valid("active", "completed", "paused", "cancelled")
  .optional(),
  expectedIncome: Joi.number().positive().required()
});

export const updateProductionCycleSchema = Joi.object({
name: Joi.string().min(2).optional(),
  cycleType: Joi.string().valid("crop", "livestock", "mixed").optional(),
  startDate: Joi.date().optional(),
  expectedEnd: Joi.date().optional(),
  status: Joi.string()
  .valid("active", "completed", "paused", "cancelled")
  .optional(),
  expectedIncome: Joi.number().positive().optional()
});