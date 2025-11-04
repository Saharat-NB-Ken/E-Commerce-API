import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 1 character",
      "string.max": "Name must be less than 255 characters",
      "any.required": "Name is required",
    }),

  description: Joi.string()
    .allow(null, "")
    .max(500)
    .messages({
      "string.base": "Description must be a string",
      "string.max": "Description must be less than 500 characters",
    })
    .optional(),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "any.required": "Price is required",
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
      "any.required": "Stock is required",
    }),

  ownerId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Owner ID must be a number",
      "number.integer": "Owner ID must be an integer",
      "number.positive": "Owner ID must be positive",
      "any.required": "Owner ID is required",
    }),

  categoryId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Category ID must be a number",
      "number.integer": "Category ID must be an integer",
      "number.positive": "Category ID must be positive",
      "any.required": "Category ID is required",
    }),

  images: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .min(1)
          .max(255)
          .required()
          .messages({
            "string.base": "Image name must be a string",
            "string.empty": "Image name is required",
            "string.min": "Image name must be at least 1 character",
            "string.max": "Image name must be less than 255 characters",
            "any.required": "Image name is required",
          }),
        url: Joi.string()
          .uri()
          .required()
          .messages({
            "string.base": "Image URL must be a string",
            "string.empty": "Image URL is required",
            "string.uri": "Image URL must be a valid URL",
            "any.required": "Image URL is required",
          }),
      })
    )
    .optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 1 character",
      "string.max": "Name must be less than 255 characters",
    })
    .optional(),

  description: Joi.string()
    .allow(null, "")
    .max(500)
    .messages({
      "string.base": "Description must be a string",
      "string.max": "Description must be less than 500 characters",
    })
    .optional(),

  price: Joi.number()
    .positive()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
    })
    .optional(),

  stock: Joi.number()
    .integer()
    .min(0)
    .messages({
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "number.min": "Stock cannot be negative",
    })
    .optional(),

  categoryId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "Category ID must be a number",
      "number.integer": "Category ID must be an integer",
      "number.positive": "Category ID must be positive",
    })
    .optional(),

  addImages: Joi.array()
    .items(
      Joi.object({
        name: Joi.string()
          .min(1)
          .max(255)
          .required()
          .messages({
            "string.base": "Image name must be a string",
            "string.empty": "Image name is required",
            "string.min": "Image name must be at least 1 character",
            "string.max": "Image name must be less than 255 characters",
            "any.required": "Image name is required",
          }),
        url: Joi.string()
          .uri()
          .required()
          .messages({
            "string.base": "Image URL must be a string",
            "string.empty": "Image URL is required",
            "string.uri": "Image URL must be a valid URL",
            "any.required": "Image URL is required",
          }),
      })
    )
    .optional(),

  removeImageIds: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
        .messages({
          "number.base": "Image ID must be a number",
          "number.integer": "Image ID must be an integer",
          "number.positive": "Image ID must be positive",
        })
    )
    .optional(),
});
