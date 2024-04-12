
const express = require('express');
const router = express.Router();
const dataAccess = require('../data/dataAccess');
const auth = require('./auth');

exports.getAllArduinoDevices = (req, res) => {
  // Llama a la función getAllArduinoDevices del módulo dataAccess.
  // Esta función debería devolver una promesa que se resuelve con todos los dispositivos Arduino de la base de datos.
  dataAccess.getAllArduinoDevices()
    .then(devices => {
      res.json(devices);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};


exports.getUserByEmail = (req, res) => {
  // Obtiene el correo electrónico del parámetro de la ruta.
  const email = req.params.email;

  // Llama a la función getUserByEmail del módulo dataAccess con el correo electrónico como argumento.
  // Esta función debería devolver una promesa que se resuelve con el usuario que tiene ese correo electrónico.
  dataAccess.getUserByEmail(email)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

exports.createUser = (req, res) => {
  // Extrae el nombre, correo electrónico y contraseña del cuerpo de la solicitud.
  const { name, email, password } = req.body;

  dataAccess.createUser(name, email, password)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      if (err.message === 'Email already exists') {
        
        res.status(409).json({ message: err.message });
      } else {
        // pendiente de más cosas
      }
    });
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

exports.getSensorsByArduinoId = (req, res) => {
  // Obtiene el ID de Arduino del parámetro de la ruta.
  const arduinoId = req.params.id;
  dataAccess.getSensorsByArduinoId(arduinoId)
    .then(sensors => {
      res.json(sensors);//añadir status
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};


exports.createArduinoDevice = (req, res) => {
  // Extrae el nombre, ubicación y estado de configuración del cuerpo de la solicitud.
  const { name, location, configState } = req.body;
  dataAccess.createArduinoDevice(name, location, configState)
    .then(device => {
      res.status(201).json(device);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

exports.getAllUsers = (req, res) => {
  dataAccess.getAllUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

exports.deleteArduino = (req, res) => {
  const arduinoId = req.params.id;
  dataAccess.deleteArduinoById(arduinoId)
    .then(() => {
      res.status(200).json({ message: 'Arduino deleted successfully.' });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};


exports.getArduino = (req, res) => {
  dataAccess.getArduinoById(req.params.id)
    .then(arduino => {
      res.status(200).json(arduino);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};


exports.login = (req, res) => {
  // TODO: Autentica al usuario
  const user = { email: req.body.name };

  const accessToken = auth.generateAccessToken(user);
  res.json({ accessToken: accessToken });
};