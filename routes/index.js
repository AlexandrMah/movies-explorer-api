const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const cors = require('cors');
const userRouter = require('./users');
const movieRouter = require('./movies');
const {
  createUser, login,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { error } = require('../middlewares/errors');
const { NotFoundError } = require('../utils/notFound');
const { requestLogger, errorLogger } = require('../middlewares/logger');
/*--------------------------*/
router.use(requestLogger);
/* ----------CORS------------*/
router.use(cors());
/*--------------------------*/
/* ------------краш-тест-----------*/
// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
/*--------------------------------*/

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use(errorLogger);

router.use((req, res, next) => {
  next(new NotFoundError('Нет такого адреса'));
});

router.use(errors());

router.use(error);

module.exports = router;
