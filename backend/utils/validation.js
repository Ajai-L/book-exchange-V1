const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createBookSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  author: Joi.string().min(1).max(255).required(),
  isbn: Joi.string().optional(),
  description: Joi.string().optional(),
  category: Joi.string().optional(),
  condition: Joi.string().valid('new', 'like_new', 'good', 'fair', 'poor').default('good'),
  bookImage: Joi.string().optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  bio: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  zipCode: Joi.string().optional(),
});

const createExchangeSchema = Joi.object({
  bookOfferedId: Joi.string().uuid().required(),
  bookRequestedId: Joi.string().uuid().required(),
  message: Joi.string().optional(),
});

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    return { isValid: false, details };
  }
  return { isValid: true, value };
};

module.exports = {
  registerSchema,
  loginSchema,
  createBookSchema,
  updateUserSchema,
  createExchangeSchema,
  validate,
};
