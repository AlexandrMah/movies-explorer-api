const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovies, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(), // страна создания фильма

    director: Joi.string().required(), // режисер фильма

    duration: Joi.number().required(), // длительность фильма

    year: Joi.string().required(), // год выпуска фильма

    description: Joi.string().required(), // описание фильма

    image: Joi.string().required().pattern(
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9\-._~:/?#[\]@!$&'()*+.;=]*)$/,
    ), // ссылка на постер к фильму

    trailerLink: Joi.string().required().pattern(
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9\-._~:/?#[\]@!$&'()*+.;=]*)$/,
    ), // ссылка на трейлер фильма

    nameRU: Joi.string(), // название фильма на русском

    nameEN: Joi.string(), // название фильма на английском

    thumbnail: Joi.string().required().pattern(
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9\-._~:/?#[\]@!$&'()*+.;=]*)$/,
    ), // миниатюрное изображение постера к фильму

    movieId: Joi.number().required(), // id фильма, который содержится в ответе сервиса MoviesExplorer

  }),
}), createMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
  }),
}), deleteMovie);

module.exports = router;