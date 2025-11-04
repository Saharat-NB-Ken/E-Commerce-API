import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            "number.base": "Product ID must be a number",
            "number.integer": "Product ID must be an integer",
            "number.positive": "Product ID must be positive",
            "any.required": "Product ID is required",
          }),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.min": "Quantity must be at least 1",
            "any.required": "Quantity is required",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Items must be an array",
      "array.min": "At least one item is required",
      "any.required": "Items are required",
    }),
});

// ============================
// OrderItemResponseDto Validator
// ============================
export const orderItemResponseSchema = Joi.object({
  productId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Product ID must be a number",
      "number.integer": "Product ID must be an integer",
      "number.positive": "Product ID must be positive",
      "any.required": "Product ID is required",
    }),
  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required",
    }),
});

// ============================
// OrderResponseDto Validator
// ============================
export const orderResponseSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Order ID must be a number",
      "number.integer": "Order ID must be an integer",
      "number.positive": "Order ID must be positive",
      "any.required": "Order ID is required",
    }),
  status: Joi.string()
    .valid("PENDING", "COMPLETED", "CANCELED")
    .required()
    .messages({
      "any.only": "Status must be one of PENDING, COMPLETED, CANCELED",
      "any.required": "Status is required",
    }),
  total: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Total must be a number",
      "number.min": "Total cannot be negative",
      "any.required": "Total is required",
    }),
  createdAt: Joi.date().required().messages({
    "date.base": "CreatedAt must be a valid date",
    "any.required": "CreatedAt is required",
  }),
  updatedAt: Joi.date().required().messages({
    "date.base": "UpdatedAt must be a valid date",
    "any.required": "UpdatedAt is required",
  }),
  items: Joi.array().items(orderItemResponseSchema).required().messages({
    "array.base": "Items must be an array",
    "any.required": "Items are required",
  }),
  payment: Joi.object({
    method: Joi.string().required(),
    amount: Joi.number().required(),
    status: Joi.string().valid("PENDING", "PAID", "FAILED", "REFUNDED").required(),
    paidAt: Joi.date().allow(null),
  }).allow(null),
});
