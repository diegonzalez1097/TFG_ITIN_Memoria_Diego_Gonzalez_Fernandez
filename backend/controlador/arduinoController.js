const express = require('express');
const router = express.Router();
const dataAccess = require('../data/dataAccess');


/**
 * Obtiene todos los dispositivos Arduino.
 * @returns {Promise<Array>} Una promesa que se resuelve con todos los dispositivos Arduino de la base de datos.
 */
exports.getAllArduinoDevices = () => {

  return dataAccess.getAllArduinoDevices();
};


/**
 * Obtiene los sensores por el ID de Arduino.
 * @param {string} arduinoId - El ID del Arduino.
 * @returns {Promise<Array>} Una promesa que se resuelve con los sensores correspondientes.
 */
exports.getSensorsByArduinoId = (arduinoId) => {

    return dataAccess.getSensorsByArduinoId(arduinoId);
};


/**
 * Crea un dispositivo Arduino.
 * @param {Object} deviceData - Los datos del dispositivo.
 * @param {string} deviceData.userId - El ID del usuario propietario del dispositivo.
 * @param {string} deviceData.name - El nombre del dispositivo.
 * @param {string} deviceData.location - La ubicación del dispositivo.
 * @param {string} deviceData.lastIP - La última dirección IP conocida del dispositivo.
 * @param {Date} deviceData.lastCommunicationDate - La última fecha de comunicación del dispositivo.
 * @param {string} deviceData.gpsCoordinates - Las coordenadas GPS del dispositivo.
 * @returns {Promise<Object>} Una promesa que se resuelve con el dispositivo Arduino creado.
 */
exports.createArduinoDevice = (deviceData) => {

    const { userId, name, location, lastIP, lastCommunicationDate, gpsCoordinates } = deviceData;

    return dataAccess.createArduinoDevice(userId, name, location, lastIP, lastCommunicationDate, gpsCoordinates);
};


/**
 * Elimina un dispositivo Arduino.
 * @param {string} arduinoId - El ID del dispositivo Arduino a eliminar.
 * @returns {Promise} Una promesa que se resuelve cuando el dispositivo Arduino se ha eliminado.
 */
exports.deleteArduino = (arduinoId) => {
    return dataAccess.deleteArduinoById(arduinoId);
};
 

/**
 * Recupera un dispositivo Arduino por su ID.
 * @param {string} arduinoId - El ID del dispositivo Arduino.
 * @returns {Promise<Object>} Una promesa que se resuelve con el dispositivo Arduino.
 */
exports.getArduinoById = (arduinoId) => {
    return dataAccess.getArduinoById(arduinoId);
};


/**
 * Obtiene todos los dispositivos Arduino para un usuario específico.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array de dispositivos Arduino.
 */
exports.getArduinosByUserId = (userId) => {
    return dataAccess.getArduinosByUserId(userId);
  };