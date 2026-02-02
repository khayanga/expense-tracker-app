import Joi from "joi";

export const createFarmProfileSchema = Joi.object({
  farmType: Joi.string().valid("crop", "livestock", "mixed").required(),
    farmName: Joi.string().min(2).max(100).required(),
  mainActivity: Joi.string().min(2).max(100).required(),
  farmSize: Joi.number().positive().optional(),
  location: Joi.string().max(100).optional()
});
