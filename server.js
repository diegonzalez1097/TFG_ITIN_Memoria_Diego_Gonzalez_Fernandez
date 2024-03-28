const http = require('http');
const userController = require('./controlador/controller');

const server = http.createServer(userController.handleRequest);

const port = 3000;

server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}/`);
});