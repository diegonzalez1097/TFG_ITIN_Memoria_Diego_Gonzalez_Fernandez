const express = require('express');
const router = express.Router();
const controller = require('../controlador/controller');

router.get('/', (req, res) => {
  res.send('Bienvenido a mi API!');
});

router.get('/arduino-devices', controller.getAllArduinoDevices);

router.get('/users/:email', controller.getUserByEmail);

router.post('/users', controller.createUser);

router.get('/users', controller.getAllUsers);

router.get('/arduino-devices/:id/sensors', controller.getSensorsByArduinoId);

router.post('/arduino-devices', controller.createArduinoDevice);



module.exports = router;