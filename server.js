const http = require('http');
const cors = require('cors');
const handleRequest = require('./api/api');

// Create a CORS middleware
const corsMiddleware = cors();

const server = http.createServer((req, res) => {
  corsMiddleware(req, res, () => {
    handleRequest(req, res);
  });
});

const port = 3000;

server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}/`);
});