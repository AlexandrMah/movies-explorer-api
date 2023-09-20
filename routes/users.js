const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  changeProfile, userInfo,
} = require('../controllers/users');

router.get('/me', userInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), changeProfile);

router.use(errors());

module.exports = router;
