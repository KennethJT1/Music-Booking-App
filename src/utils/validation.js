const Joi = require("joi");
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

exports.artistSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have at least 2 characters",
    "string.max": "Name should not exceed 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should have at least 6 characters",
    "any.required": "Password is required",
  }),

  bio: Joi.string().min(10).max(500).required().messages({
    "string.base": "Bio must be a string",
    "string.empty": "Bio cannot be empty",
    "string.min": "Bio should have at least 10 characters",
    "string.max": "Bio should not exceed 500 characters",
    "any.required": "Bio is required",
  }),

  genre: Joi.string().min(3).max(30).required().messages({
    "string.base": "Genre must be a string",
    "string.empty": "Genre cannot be empty",
    "string.min": "Genre should have at least 3 characters",
    "string.max": "Genre should not exceed 30 characters",
    "any.required": "Genre is required",
  }),

  socialLinks: Joi.object().optional().messages({
    "object.base": "Social links must be a valid object",
  }),
});

exports.updateArtistSchema = exports.artistSchema.fork(
  ["name", "email", "password", "bio", "genre", "socialLinks"],
  (field) => field.optional()
);

exports.eventSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title must not exceed 100 characters.",
    "any.required": "Title is required.",
  }),
  date: Joi.date().iso().greater("now").required().messages({
    "date.base": "Date must be a valid date.",
    "date.format": "Date must be in ISO format.",
    "date.greater": "Date must be in the future.",
    "any.required": "Date is required.",
  }),
  description: Joi.string().max(2000).optional().messages({
    "string.base": "Description must be a string.",
    "string.max": "Description must not exceed 2000 characters.",
  }),
  location: Joi.string().min(2).max(255).required().messages({
    "string.base": "Location must be a string.",
    "string.empty": "Location is required.",
    "string.min": "Location must be at least 2 characters long.",
    "string.max": "Location must not exceed 255 characters.",
    "any.required": "Location is required.",
  }),
  currency: Joi.string().length(3).required().messages({
    "string.base": "Currency must be a string.",
    "string.length": "Currency must be exactly 3 characters long.",
    "any.required": "Currency is required.",
  }),
  amount: Joi.number().greater(0).required().messages({
    "number.base": "Amount must be a number.",
    "number.greater": "Amount must be greater than 0.",
    "any.required": "Amount is required.",
  }),
});

exports.updateEventSchema = exports.eventSchema.fork(
  ["title", "date", "description", "location","currency","amount"],
  (field) => field.optional()
);

exports.bookingSchema = Joi.object({
  eventId: Joi.string()
    .pattern(uuidPattern)
    .required()
    .messages({
      "string.base": "Event ID must be a string",
      "string.empty": "Event ID cannot be empty",
      "string.pattern.base": "Event ID must be a valid UUID",
      "any.required": "Event ID is required",
    }),

  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name should have at least 2 characters",
      "string.max": "Name should not exceed 50 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.empty": "Email cannot be empty",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
});
