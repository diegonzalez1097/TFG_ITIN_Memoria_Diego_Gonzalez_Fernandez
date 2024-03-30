const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', (req, res) => {
  res.send('Bienvenido a mi API!');
});

app.get('/users', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/users');
    res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
  } catch (error) {
    console.error(error);
    res.send('Error al obtener los datos');
  }
});

app.get('/user/:username', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/user/${req.params.username}`);
    res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
  } catch (error) {
    console.error(error);
    res.send('Error al obtener los datos');
  }
});

app.get('/user/:username/age', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3000/user/${req.params.username}/age`);
    res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
  } catch (error) {
    console.error(error);
    res.send('Error al obtener la edad del usuario');
  }
});

app.listen(3001, () => {
  console.log('Servidor en ejecución en http://localhost:3001');
});