import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            "string.name": "Name must be valid",
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
    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm Password is required",
        }),
});


export const loginSchema = Joi.object({
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
});

