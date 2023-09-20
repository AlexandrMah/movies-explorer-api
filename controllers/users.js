const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
/* --------.env---------*/
require('dotenv').config();

/*---------------------*/
const User = require('../models/user');

/* ------Ошибки--------*/
const { BadRequestError } = require('../utils/badRequest');
const { UnauthorizedError } = require('../utils/unauthorized');
const { NotFoundError } = require('../utils/notFound');
const { ConflictError } = require('../utils/conflict');

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash });
    res.status(201).send({
      _id: user._id, name: user.name, email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Введены некорректные данные'));
      return;
    }

    if (err.code === 11000) {
      next(new ConflictError('Такая почта уже есть'));
      return;
    }
    next(err);
  }
};

function changeProfile(req, res, next) {
  const id = req.user._id;
  const { name, email } = req.body;
  return User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .orFail(new Error('DocumentNotFoundError'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.massage === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет такого адреса'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Такая почта уже есть'));
      } else {
        next(err);
      }
    });
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    // /*--------.env---------*/
    const { NODE_ENV, JWT_SECRET = '29af84f0aad493a9297699fb973aedbeb0f73de1d0d5e7c6d6a290550cf56c10' } = process.env;

    const token = JWT.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    /*---------------------*/
    res.status(200).send({ token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Введены некорректные данные'));
      return;
    }
    next(err);
  }
};

const userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('DocumentNotFoundError'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет такого адреса'));
        return;
      }
      next(err);
    });
};

const userOut = (req, res) => {
  res.clearCookie('token').send({ message: 'Выход выполнен' });
};

module.exports = {
  createUser,
  userInfo,
  changeProfile,
  login,
  userOut,
};
