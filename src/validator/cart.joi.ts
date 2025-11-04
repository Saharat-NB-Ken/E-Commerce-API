import Joi from "joi";

export const addCartItemSchema = Joi.object({
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
    .default(1)
    .messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 1",
    })
    .optional(),
});

export const updateCartItemSchema = Joi.object({
  cartItemId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Cart item ID must be a number",
      "number.integer": "Cart item ID must be an integer",
      "number.positive": "Cart item ID must be positive",
      "any.required": "Cart item ID is required",
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
});

// ============================
// CartItemResponseDto Validator (Optional, for testing / validation)
// ============================
export const cartItemResponseSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Cart item ID must be a number",
      "number.integer": "Cart item ID must be an integer",
      "number.positive": "Cart item ID must be positive",
      "any.required": "Cart item ID is required",
    }),

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

  productName: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.base": "Product name must be a string",
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 1 character",
      "string.max": "Product name must be less than 255 characters",
      "any.required": "Product name is required",
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required",
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

  createdAt: Joi.date().required().messages({
    "date.base": "CreatedAt must be a valid date",
    "any.required": "CreatedAt is required",
  }),

  updatedAt: Joi.date().required().messages({
    "date.base": "UpdatedAt must be a valid date",
    "any.required": "UpdatedAt is required",
  }),
});

// ============================
// CartResponseDto Validator (Optional, for testing / validation)
// ============================
export const cartResponseSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Cart ID must be a number",
      "number.integer": "Cart ID must be an integer",
      "number.positive": "Cart ID must be positive",
      "any.required": "Cart ID is required",
    }),

  userId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "User ID must be a number",
      "number.integer": "User ID must be an integer",
      "number.positive": "User ID must be positive",
      "any.required": "User ID is required",
    }),

  items: Joi.array().items(cartItemResponseSchema).required().messages({
    "array.base": "Items must be an array",
    "any.required": "Items are required",
  }),

  totalItems: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Total items must be a number",
      "number.integer": "Total items must be an integer",
      "number.min": "Total items cannot be negative",
      "any.required": "Total items is required",
    }),

  totalPrice: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Total price must be a number",
      "number.min": "Total price cannot be negative",
      "any.required": "Total price is required",
    }),

  createdAt: Joi.date().required().messages({
    "date.base": "CreatedAt must be a valid date",
    "any.required": "CreatedAt is required",
  }),

  updatedAt: Joi.date().required().messages({
    "date.base": "UpdatedAt must be a valid date",
    "any.required": "UpdatedAt is required",
  }),
});
