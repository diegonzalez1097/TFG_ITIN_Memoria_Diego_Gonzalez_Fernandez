const http = require('http');
const url = require('url');
const controller = require('./controlador/controller');


const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
  
    if (reqUrl.pathname === '/users') {
      controller.handleGetAllUsersRequest(req, res);
    } else if (reqUrl.pathname.startsWith('/user/')) {
      const userName = reqUrl.pathname.split('/')[2];
      controller.handleGetUserRequest(req, res, userName);
    } else {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Not Found\n');
    }
  });
  
  server.listen(3001, () => {
    console.log('Servidor en ejecución en http://localhost:3001/');
  });