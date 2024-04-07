
const express = require('express');
const router = express.Router();
const dataAccess = require('../data/dataAccess');

exports.getAllArduinoDevices = (req, res) => {
  dataAccess.getAllArduinoDevices()
    .then(devices => {
      res.json(devices);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

exports.getUserByEmail = (req, res) => {
  const email = req.params.email;
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
  const { name, email, password } = req.body;
  dataAccess.createUser(name, email, password)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      if (err.message === 'Email already exists') {
        res.status(409).json({ message: err.message });
      } else {
        // pendiente de mas cosas
      }
    });
};
exports.getSensorsByArduinoId = (req, res) => {
  const arduinoId = req.params.id;
  dataAccess.getSensorsByArduinoId(arduinoId)
    .then(sensors => {
      res.json(sensors);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
};

exports.createArduinoDevice = (req, res) => {
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