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

  exports.getUserAge = async (req, res) => {
    const userName = req.params.username;
    try {
      const age = await dataAccess.getUserAge(userName);
      if (age !== null) {
        res.json({ age });
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener la edad del usuario');
    }
  };