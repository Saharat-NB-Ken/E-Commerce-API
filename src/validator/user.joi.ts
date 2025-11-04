import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name must be less than 50 characters",
            "any.required": "Name is required",
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Email must be valid",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(6)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,30}$"))
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters",
            "string.pattern.base":
                "Password must include at least 1 uppercase, 1 lowercase, and 1 number",
            "any.required": "Password is required",
        }),

    // confirmPassword: Joi.any()
    //     .valid(Joi.ref("password"))
    //     .required()
    //     .messages({
    //         "any.only": "Passwords do not match",
    //         "any.required": "Confirm Password is required",
    //     }),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50).messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 2 characters",
        "string.max": "Name must be less than 50 characters",
    }).optional(),
    email: Joi.string().email().messages({
        "string.email": "Email must be valid",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
    }).optional(),
    role: Joi.string().valid("ADMIN", "USER", "MERCHANT").messages({
        "any.only": "Role must be one of ADMIN, USER, or MERCHANT",
        "string.base": "Role must be a string",
    }).optional(),
    // confirmPassword: Joi.any().valid(Joi.ref("password")).optional(),
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.min": "Current password must be at least 6 characters",
            "any.required": "Current password is required",
        }),
    newPassword: Joi.string()
        .min(6)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,30}$"))
        .required()
        .messages({
            "string.min": "New password must be at least 6 characters",
            "string.pattern.base":
                "New password must include at least 1 uppercase, 1 lowercase, and 1 number",
            "any.required": "New password is required",
        }),
    confirmNewPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "New passwords do not match",
            "any.required": "Confirm new password is required",
        }),
});