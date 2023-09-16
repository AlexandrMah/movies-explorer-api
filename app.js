const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(routes);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(PORT, () => {
    console.error(`Application is running on port ${PORT}`);
  });
}

main();