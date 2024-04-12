const express = require('express');
const passport = require('passport');
const router = express.Router();


const userController = require('../controlador/userController');
const arduinoController = require('../controlador/arduinoController');



router.get('/', (req, res) => {
  res.send('Bienvenido a mi API!');
});


//Rutas de usuario

//GETS
router.get('/users/:email', async (req, res) => {
  try {
    const user = await userController.getUserByEmail(req.params.email);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users/:userId/arduinos', async (req, res) => {
  try {
    const arduinos = await arduinoController.getArduinosByUserId(req.params.userId);
    res.json(arduinos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//POSTS
router.post('/users', async (req, res) => {
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'Email already exists') {
      res.status(409).json({ message: err.message });
    } else {
      // pendiente de más cosas
      res.status(500).json({ message: err.message });
    }
  }
});


//Rutas de dispositivos Arduino


//GETS
router.get('/arduino-devices/:id/sensors', async (req, res) => {
  try {
    const sensors = await arduinoController.getSensorsByArduinoId(req.params.id);
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/arduino-devices/:id', async (req, res) => {
  try {
    const arduino = await arduinoController.getArduinoById(req.params.id);
    res.json(arduino);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/arduino-devices', async (req, res) => {
  try {
    const devices = await arduinoController.getAllArduinoDevices();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//POSTS
router.post('/arduino-devices', async (req, res) => {
  try {
    const device = await arduinoController.createArduinoDevice(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//DELETES
router.delete('/arduino-devices/:id', async (req, res) => {
  try {
    await arduinoController.deleteArduino(req.params.id);
    res.json({ message: 'Arduino deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;