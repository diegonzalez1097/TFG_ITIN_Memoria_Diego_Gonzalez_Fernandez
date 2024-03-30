
const controller = require('../controlador/controller');

const handleRequest = (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  if (reqUrl.pathname === '/users' && req.method === 'GET') {
    controller.handleGetAllUsersRequest(req, res);
  } else if (reqUrl.pathname.startsWith('/user/') && req.method === 'GET') {
    const pathSegments = reqUrl.pathname.split('/');
    const userName = pathSegments[2];
    if (pathSegments.length === 4 && pathSegments[3] === 'age') {
      controller.getUserAge(req, res, userName);
    } else {
      controller.handleGetUserRequest(req, res, userName);
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found\n');
  }
};

module.exports = handleRequest;