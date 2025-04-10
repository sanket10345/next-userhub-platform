const Joi = require('joi');

const userSchema = Joi.object({
  user: Joi.string().min(1).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  interest: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one interest must be specified',
    'any.required': 'Interests are required'
  }),
  age: Joi.number().integer().min(1).required().messages({
    'number.base': 'Age must be a number',
    'any.required': 'Age is required'
  }),
  mobile: Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).required().messages({//pattern(/^[0-9]+$/)
    'number.base': 'Mobile must be a number',
    'any.required': 'Mobile is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required'
  }),
});
// For update: allow optional fields and include _id
const updateUserSchema = userSchema
  .fork(['user', 'email', 'age', 'mobile', 'interest'], (schema) => schema.optional())
  .keys({
    _id: Joi.string().required(), // assuming you want _id in body for updates
  });
module.exports = {
    userSchema,
    updateUserSchema
};