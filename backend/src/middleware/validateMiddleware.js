// src/middleware/validate.js
import Joi from "joi";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });
    if (result.error) {
      return res
        .status(400)
        .json({ error: result.error.details.map((d) => d.message).join(", ") });
    }
    req.validatedBody = result.value;
    return next();
  };
}
