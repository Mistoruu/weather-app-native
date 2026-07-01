import Joi from 'joi';

export const validate = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return { isValid: true, errors: {} };

  const errors = {};
  error.details.forEach((detail) => {
    errors[detail.context.key] = detail.message;
  });
  return { isValid: false, errors };
};

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'L\'email est obligatoire.',
    'string.email': 'Email invalide.'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Le mot de passe est obligatoire.'
  })
});

export const registerSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'L\'email est obligatoire.',
    'string.email': 'Email invalide.'
  }),
  password: Joi.string().min(8).pattern(/[A-Z]/, 'majuscule').pattern(/[0-9]/, 'chiffre').required().messages({
    'string.empty': 'Le mot de passe est obligatoire.',
    'string.min': '8 caractères minimum.',
    'string.pattern.name': 'Doit contenir au moins une {#name}.'
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Les mots de passe ne correspondent pas.',
    'any.required': 'Veuillez confirmer le mot de passe.'
  })
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'L\'email est obligatoire.',
    'string.email': 'Email invalide.'
  })
});