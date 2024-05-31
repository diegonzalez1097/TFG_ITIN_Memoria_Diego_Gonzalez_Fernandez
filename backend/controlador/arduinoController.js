const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;


const arduinoAccess = require('../data/arduinoData');


/**
 * Obtiene todos los dispositivos Arduino.
 * @returns {Promise<Array>} Una promesa que se resuelve con todos los dispositivos Arduino de la base de datos.
 */
exports.getAllArduinoDevices = () => {

  return arduinoAccess.getAllArduinoDevices();
};


/**
 * Obtiene los sensores por el ID de Arduino.
 * @param {string} arduinoId - El ID del Arduino.
 * @returns {Promise<Array>} Una promesa que se resuelve con los sensores correspondientes.
 */
exports.getSensorsByArduinoId = (arduinoId) => {

    return arduinoAccess.getSensorsByArduinoId(arduinoId);
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
    const { userId, name, location, lastIP, lastCommunicationDate, gpsCoordinates, mac } = deviceData;
    return arduinoAccess.createArduinoDevice(userId, name, location, lastIP, lastCommunicationDate, gpsCoordinates, mac);
};


/**
 * Elimina un dispositivo Arduino.
 * @param {string} arduinoId - El ID del dispositivo Arduino a eliminar.
 * @returns {Promise} Una promesa que se resuelve cuando el dispositivo Arduino se ha eliminado.
 */
exports.deleteArduino = (arduinoId) => {
    return arduinoAccess.deleteArduinoById(arduinoId);
};
 

/**
 * Recupera un dispositivo Arduino por su ID.
 * @param {string} arduinoId - El ID del dispositivo Arduino.
 * @returns {Promise<Object>} Una promesa que se resuelve con el dispositivo Arduino.
 */
exports.getArduinoById = (arduinoId) => {
    return arduinoAccess.getArduinoById(arduinoId);
};


/**
 * Obtiene todos los dispositivos Arduino para un usuario específico.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array de dispositivos Arduino.
 */
exports.getArduinosByUserId = (userId) => {
    return arduinoAccess.getArduinosByUserId(userId);
};

/**
 * Obtiene todos los dispositivos Arduino para una dirección MAC específica.
 * @param {string} mac - La dirección MAC.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array de dispositivos Arduino.
 */
exports.getArduinosByMac = (mac) => {
    return arduinoAccess.getArduinosByMac(mac);
};

/**
 * Comprueba si existe un Arduino con una dirección MAC específica. Si no existe, crea uno nuevo.
 * @param {string} mac - La dirección MAC.
 * @returns {Promise<Object>} Una promesa que se resuelve con el dispositivo Arduino.
 */
exports.registroArduino = async (deviceData) => {
    const { userId, name, location, ultimaIP, fechaUltimaComunicacion, gpsCoordinates, mac } = deviceData;
    let arduino = await arduinoAccess.getArduinosByMac(mac);

    if (!arduino || arduino.length === 0) {
        arduino = await arduinoAccess.createArduinoDevice(userId, name, location, ultimaIP, fechaUltimaComunicacion, gpsCoordinates, mac);
    }

    // Crea un token JWT que incluye la dirección MAC del Arduino
    const token = jwt.sign({ mac: arduino.mac }, process.env.SECRET_KEY, { expiresIn: '1h' });

    return {
        arduino,
        token
    };
};


/**
 * Creates a new sensor in the database.
 * @param {Object} sensorData - The sensor data.
 * @returns {Promise<Object>} A promise that resolves when the sensor is successfully created.
 * @throws {Error} If there is an error creating the sensor.
 */
exports.createSensor = async (sensorData) => {
    const { deviceId, sensorType, associatedPins, description } = sensorData;
    let sensor = await arduinoAccess.createSensor(deviceId, sensorType, associatedPins, description);

    return sensor;
};

/**
 * Updates an Arduino device.
 * @param {string|number} idDispositivo - The ID of the Arduino device.
 * @param {Object} updateData - The data to update the Arduino device with.
 * @returns {Promise<Object>} A promise that resolves with the updated Arduino device.
 * @throws {Error} If there is an error updating the Arduino device.
 */
exports.updateArduino = async (idDispositivo, updateData) => {
    const updatedArduino = await arduinoAccess.updateArduino(idDispositivo, updateData);
    return updatedArduino;
  };


  /**
 * Inserts a new sensor reading into the database.
 * @param {Object} readingData - The sensor reading data.
 * @returns {Promise<Object>} A promise that resolves when the sensor reading is successfully inserted.
 * @throws {Error} If there is an error inserting the sensor reading.
 */
exports.insertSensorReading = async (readingData) => {
    const { sensorId, dateTime, value } = readingData;
    let reading = await arduinoAccess.insertSensorReading(sensorId, dateTime, value);

    return reading;
};