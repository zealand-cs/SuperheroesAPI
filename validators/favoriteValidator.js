const Joi = require('joi');

const schema = Joi.object({
  id: Joi.number().required(),
  note: Joi.string().min(2).required()
});

function validateFavorite(req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

module.exports = { validateFavorite };
