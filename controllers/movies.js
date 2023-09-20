const Movie = require('../models/movie');

/* ---------Ошибки-----------------*/
const { BadRequestError } = require('../utils/badRequest');
const { ForbiddenError } = require('../utils/forbidden');
const { NotFoundError } = require('../utils/notFound');
/*-------------------------------*/

function getMovies(req, res, next) {
  return Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
}

function createMovies(req, res, next) {
  const id = req.user._id;
  return Movie.create({ ...req.body, owner: id }).then((user) => {
    res.status(201).send(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
        return;
      }
      next(err);
    });
}

function deleteMovie(req, res, next) {
  const id = req.params.movieId;
  const userId = req.user._id;
  return Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Нет такого id'));
        return;
      }

      if (userId !== movie.owner.toString()) {
        next(new ForbiddenError('Недостаточно прав для удаления этого фильма'));
        return;
      }

      movie.deleteOne({ _id: id })
        .then(() => res.status(200).send({ message: 'Фильм удален успешно' }));
    })
    .catch((err) => next(err));
}

module.exports = {
  getMovies,
  deleteMovie,
  createMovies,
};
