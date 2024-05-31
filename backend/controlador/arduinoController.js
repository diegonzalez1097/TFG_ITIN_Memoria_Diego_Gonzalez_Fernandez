const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;


const arduinoAccess = require('../data/arduinoData');

const cron = require('node-cron');

let inMemoryReadings = [];


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
 * Crea un nuevo sensor en la base de datos.
 * @param {Object} sensorData - Los datos del sensor.
 * @returns {Promise<Object>} Una promesa que se resuelve cuando el sensor se crea con éxito.
 * @throws {Error} Si hay un error al crear el sensor.
 */
exports.createSensor = async (sensorData) => {
    const { deviceId, sensorType, associatedPins, description } = sensorData;
    let sensor = await arduinoAccess.createSensor(deviceId, sensorType, associatedPins, description);

    return sensor;
};

/**
 * Actualiza un dispositivo Arduino.
 * @param {string|number} idDispositivo - El ID del dispositivo Arduino.
 * @param {Object} updateData - Los datos para actualizar el dispositivo Arduino.
 * @returns {Promise<Object>} Una promesa que se resuelve con el dispositivo Arduino actualizado.
 * @throws {Error} Si hay un error al actualizar el dispositivo Arduino.
 */
exports.updateArduino = async (idDispositivo, updateData) => {
    const updatedArduino = await arduinoAccess.updateArduino(idDispositivo, updateData);
    return updatedArduino;
  };


/**
 * Inserta nuevas lecturas de sensor en la base de datos.
 * @param {Array} readingsData - Un array de objetos de datos de lectura del sensor.
 * @returns {Promise<Array>} Una promesa que se resuelve cuando todas las lecturas del sensor se insertan con éxito.
 * @throws {Error} Si hay un error al insertar una lectura del sensor.
 */
exports.insertSensorReadings = async (readingsData) => {
    let readings = [];
    for (let readingData of readingsData) {
        let reading = await arduinoAccess.insertSensorReadings([readingData]);
        readings.push(reading);
    }

    return readings;
};


/**
 * Inserta nuevas lecturas de sensor en el array en memoria.
 * @param {Array} readingsData - Un array de objetos de datos de lectura del sensor.
 */
exports.receiveSensorReadings = (readingsData, arduinoData) => {
    for (let readingData of readingsData) {
        inMemoryReadings.push(readingData);
    }

    // Extrae el idDispositivo de arduinoData
    const { idDispositivo, ...updateData } = arduinoData;

    // Llama a la función updateArduino con el idDispositivo y los datos de actualización
    exports.updateArduino(idDispositivo, updateData);

    return inMemoryReadings;
};

/**
 * Esta función se ejecuta cada minuto (según lo programado por cron.schedule).
 * Recorre el array `inMemoryReadings` y guarda cada lectura en la base de datos.
 * Después de guardar todas las lecturas, vacía el array `inMemoryReadings`.
 */
cron.schedule('* * * * *', async () => {
    for (let reading of inMemoryReadings) {
        await exports.insertSensorReadings([reading]);
    }
    inMemoryReadings = [];
});

/**
 * Devuelve el array en memoria de lecturas del sensor.
 * @returns {Array} El array en memoria de lecturas del sensor.
 */
exports.getSensorReadings = () => {
    return inMemoryReadings;
};