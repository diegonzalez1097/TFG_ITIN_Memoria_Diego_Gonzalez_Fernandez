/**
 * Module for accessing data from the database.
 * @module dataAccess
 */

const mysql = require('mysql');

require('dotenv').config();

// Configura la conexión con la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

/**
 * Connects to the MySQL database.
 * @param {function} callback - The callback function to be executed after connecting to the database.
 * @throws {Error} If there is an error connecting to the database.
 */
connection.connect((err) => {
  if (err){
    console.error('Error al conectar a la base de datos MySQL: ' + err.stack);
    return;
  }
  //console.log('Conectado a la base de datos MySQL!');
});

/**
 * Retrieves all Arduino devices from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of Arduino devices.
 * @throws {Error} If there is an error retrieving the Arduino devices.
 */
exports.getAllArduinoDevices = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM dispositivos_arduino', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


/**
 * Retrieves all sensors for a given Arduino device from the database.
 * @param {number} arduinoId - The ID of the Arduino device.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of sensors.
 * @throws {Error} If there is an error retrieving the sensors.
 */
exports.getSensorsByArduinoId = (arduinoId) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM dispositivos_sensores WHERE idDispositivo = ?', [arduinoId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

/**
 * Creates a new Arduino device in the database.
 * @param {number} userId - The id of the user.
 * @param {string} name - The name of the Arduino device.
 * @param {string} location - The location of the Arduino device.
 * @param {string} lastIP - The last IP of the Arduino device.
 * @param {Date} lastCommunicationDate - The last communication date of the Arduino device.
 * @param {Object} gpsCoordinates - The GPS coordinates of the Arduino device.
 * @returns {Promise<Object>} A promise that resolves to the created Arduino device object.
 * @throws {Error} If there is an error creating the Arduino device.
 */
exports.createArduinoDevice = (userId, name, location, lastIP, lastCommunicationDate, gpsCoordinates) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO dispositivos_arduino (idUsuario, nombre, ubicacion, ultimaIP, fechaUltimaComunicacion, coordenadasGPS) VALUES (?, ?, ?, ?, ?, ST_GeomFromText(?))', 
    [userId, name, location, lastIP, lastCommunicationDate, 'POINT(' + gpsCoordinates.x + ' ' + gpsCoordinates.y + ')'], 
    (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


/**
 * Deletes an Arduino device from the database.
 * @param {number} arduinoId - The ID of the Arduino device.
 * @returns {Promise<void>} A promise that resolves when the Arduino device has been deleted.
 * @throws {Error} If there is an error deleting the Arduino device.
 */
exports.deleteArduinoById = (arduinoId) => {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM dispositivos_arduino WHERE idDispositivo = ?', [arduinoId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


/**
 * Retrieves a device by id from the database.
 * @param {number} id - The id of the device.
 * @returns {Promise<Object>} A promise that resolves to the device object.
 * @throws {Error} If there is an error retrieving the device.
 */
exports.getArduinoById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM dispositivos_arduino WHERE idDispositivo = ?', [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

/**
 * Retrieves all Arduino devices for a specific user from the database.
 * @param {number} userId - The id of the user.
 * @returns {Promise<Array>} A promise that resolves to an array of Arduino devices.
 * @throws {Error} If there is an error retrieving the Arduino devices.
 */
exports.getArduinosByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM dispositivos_arduino WHERE idUsuario = ?', [userId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};