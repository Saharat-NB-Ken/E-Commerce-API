import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.base": "Category name must be a string",
      "string.empty": "Category name cannot be empty",
      "string.min": "Category name must be at least 2 characters",
      "string.max": "Category name must not exceed 100 characters",
      "any.required": "Category name is required",
    }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      "string.base": "Category name must be a string",
      "string.min": "Category name must be at least 2 characters",
      "string.max": "Category name must not exceed 100 characters",
    }),
});


export const categoryIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Category ID must be a number",
    "number.integer": "Category ID must be an integer",
    "number.positive": "Category ID must be positive",
    "any.required": "Category ID is required",
  }),
});
