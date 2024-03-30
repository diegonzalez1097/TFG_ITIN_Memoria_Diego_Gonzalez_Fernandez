const http = require('http');
const handleRequest = require('./api/api');

const server = http.createServer(handleRequest);

const port = 3000;

server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}/`);
});