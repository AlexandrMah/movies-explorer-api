const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({

  country: { // страна создания фильма. Обязательное поле-строка.
    type: String,
    required: [true, 'Поле "country" должно быть заполнено'],
  },

  director: { // режиссёр фильма. Обязательное поле-строка.
    type: String,
    required: [true, 'Поле "director" должно быть заполнено'],
  },

  duration: { // длительность фильма. Обязательное поле-число.
    type: Number,
    required: [true, 'Поле "duration" должно быть заполнено'],
  },

  year: { // год выпуска фильма. Обязательное поле-строка.
    type: String,
    required: [true, 'Поле "year" должно быть заполнено'],
  },

  description: { // описание фильма. Обязательное поле-строка.
    type: String,
    required: [true, 'Поле "description" должно быть заполнено'],
  },

  image: { // ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Введен некорректный адрес расположения постера',
    },
    required: [true, 'Поле "image" должно быть заполнено'],
  },

  trailerLink: { // ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом.
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Введен некорректный адрес трейлера фильма',
    },
    required: [true, 'Поле "trailerLink" должно быть заполнено'],
  },

  thumbnail: { // миниатюрное изображение постера к фильму. Обязательное поле-строка. Запишите её URL-адресом.
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Введен некорректный адрес трейлера фильма',
    },
    required: [true, 'Поле "thumbnail" должно быть заполнено'],
  },

  owner: { // id пользователя, который сохранил фильм. Обязательное поле.
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  movieId: { // id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле в формате number.
    type: Number,
    required: [true, 'Поле "movieId" должно быть заполнено'],
  },

  nameRU: { // название фильма на русском языке. Обязательное поле-строка.
    type: String,
    required: [true, 'Поле "nameRU" должно быть заполнено'],
  },

  nameEN: { // название фильма на английском языке. Обязательное поле-строка.
    type: String,
    required: [true, 'Поле "nameEN" должно быть заполнено'],
  },

  versionKey: false,
});

module.exports = mongoose.model('movies', movieSchema);
