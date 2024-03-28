const dataAccess = require('../data/dataAccess');


exports.handleGetAllUsersRequest = (req, res) => {
    dataAccess.getAllUsers()
      .then(users => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(users));
      })
      .catch(err => {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err.message);
      });
  };
  exports.handleGetUserRequest = (req, res, userName) => {
    dataAccess.getUser(userName)
      .then(user => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
      })
      .catch(err => {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err.message);
      });
  };