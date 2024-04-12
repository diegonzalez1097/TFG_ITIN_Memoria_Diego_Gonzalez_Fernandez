const express = require('express');
const cors = require('cors');
const routes = require('./api/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}/`);
});