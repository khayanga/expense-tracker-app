
import  Joi from 'joi';

export const createStageSchema = Joi.object({
    name: Joi.string().min(2).required(),
    category: Joi.string().allow(null, ""),
    plannedCost: Joi.number().positive().required(),
    status: Joi.string().valid("pending", "in_progress", "completed", "delayed").optional(),
    startDate: Joi.date().optional(),
    dueDate: Joi.date().optional()

})

export const updateStageSchema = Joi.object({
    name: Joi.string().min(2).optional(),
    category: Joi.string().allow(null, ""),
    plannedCost: Joi.number().positive().optional(),
    status: Joi.string().valid("pending", "in_progress", "completed", "delayed").optional(),
    startDate: Joi.date().optional(),
    dueDate: Joi.date().optional()

})

export const logExpenseSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().optional()
});