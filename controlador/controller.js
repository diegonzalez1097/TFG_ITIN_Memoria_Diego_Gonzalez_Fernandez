
const express = require('express');
const router = express.Router();
const dataAccess = require('../data/dataAccess');

exports.getAllArduinoDevices = (req, res) => {
  // Llama a la función getAllArduinoDevices del módulo dataAccess.
  // Esta función debería devolver una promesa que se resuelve con todos los dispositivos Arduino de la base de datos.
  dataAccess.getAllArduinoDevices()
    .then(devices => {
      // Si la promesa se resuelve con éxito, envía una respuesta con los dispositivos como cuerpo de la respuesta.
      res.json(devices);
    })
    .catch(err => {
      // Si la promesa es rechazada (es decir, si ocurre un error), envía una respuesta con estado 500 (Error interno del servidor)
      // y un mensaje de error.
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
        // Si la promesa se resuelve con éxito y el usuario existe, envía una respuesta con el usuario como cuerpo de la respuesta.
        res.json(user);
      } else {
        // Si la promesa se resuelve con éxito pero el usuario no existe, envía una respuesta con estado 404 (No encontrado)
        // y un mensaje de error.
        res.status(404).send('Usuario no encontrado');
      }
    })
    .catch(err => {
      // Si la promesa es rechazada (es decir, si ocurre un error), envía una respuesta con estado 500 (Error interno del servidor)
      // y un mensaje de error.
      res.status(500).json({ message: err.message });
    });
};

exports.createUser = (req, res) => {
  // Extrae el nombre, correo electrónico y contraseña del cuerpo de la solicitud.
  const { name, email, password } = req.body;

  // Llama a la función createUser del módulo dataAccess con el nombre, correo electrónico y contraseña como argumentos.
  // Esta función debería devolver una promesa que se resuelve con el usuario creado.
  dataAccess.createUser(name, email, password)
    .then(user => {
      // Si la promesa se resuelve con éxito, envía una respuesta con estado 201 (Creado)
      // y el usuario como cuerpo de la respuesta.
      res.status(201).json(user);
    })
    .catch(err => {
      if (err.message === 'Email already exists') {
        // Si la promesa es rechazada con un mensaje de error 'Email already exists',
        // envía una respuesta con estado 409 (Conflicto) y un mensaje de error.
        res.status(409).json({ message: err.message });
      } else {
        // pendiente de más cosas
      }
    });
};


exports.getSensorsByArduinoId = (req, res) => {
  // Obtiene el ID de Arduino del parámetro de la ruta.
  const arduinoId = req.params.id;

  // Llama a la función getSensorsByArduinoId del módulo dataAccess con el ID de Arduino como argumento.
  // Esta función debería devolver una promesa que se resuelve con los sensores que tienen ese ID de Arduino.
  dataAccess.getSensorsByArduinoId(arduinoId)
    .then(sensors => {
      // Si la promesa se resuelve con éxito, envía una respuesta con los sensores como cuerpo de la respuesta.
      res.json(sensors);
    })
    .catch(err => {
      // Si la promesa es rechazada (es decir, si ocurre un error), envía una respuesta con estado 500 (Error interno del servidor)
      // y un mensaje de error.
      res.status(500).json({ message: err.message });
    });
};


exports.createArduinoDevice = (req, res) => {
  // Extrae el nombre, ubicación y estado de configuración del cuerpo de la solicitud.
  const { name, location, configState } = req.body;

  // Llama a la función createArduinoDevice del módulo dataAccess con el nombre, ubicación y estado de configuración como argumentos.
  // Esta función debería devolver una promesa que se resuelve con el dispositivo Arduino creado.
  dataAccess.createArduinoDevice(name, location, configState)
    .then(device => {
      // Si la promesa se resuelve con éxito, envía una respuesta con estado 201 (Creado)
      // y el dispositivo como cuerpo de la respuesta.
      res.status(201).json(device);
    })
    .catch(err => {
      // Si la promesa es rechazada (es decir, si ocurre un error), envía una respuesta con estado 500 (Error interno del servidor)
      // y un mensaje de error.
      res.status(500).json({ message: err.message });
    });
};

exports.getAllUsers = (req, res) => {
  // Llama a la función getAllUsers del módulo dataAccess.
  // Esta función debería devolver una promesa que se resuelve con todos los usuarios de la base de datos.
  dataAccess.getAllUsers()
    .then(users => {
      // Si la promesa se resuelve con éxito, envía una respuesta con estado 200 (OK)
      // y los usuarios como cuerpo de la respuesta.
      res.status(200).json(users);
    })
    .catch(err => {
      // Si la promesa es rechazada (es decir, si ocurre un error), envía una respuesta con estado 500 (Error interno del servidor)
      // y un mensaje de error.
      res.status(500).json({ message: err.message });
    });
};