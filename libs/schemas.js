import Joi from '@hapi/joi';

export const UserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().required(),
  birthDate: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  streetAddress: Joi.string(),
  locality: Joi.string(),
  postalCode: Joi.number(),
  city: Joi.string(),
  state: Joi.string(),
  country: Joi.string()
});

export const UpdateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  gender: Joi.string(),
  birthDate: Joi.string()
});

export const VerifyLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const ProductSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  categoryId: Joi.number().required(),
  description: Joi.string(),
  currency: Joi.string(),
  unitPrice: Joi.number().required()
});

export const BrowseProducts = Joi.object({
  id: Joi.number(),
  name: Joi.string(),
  categoryId: Joi.number()
});
