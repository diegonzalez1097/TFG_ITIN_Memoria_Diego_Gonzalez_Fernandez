/**
 * Module for accessing data from the database.
 * @module dataAccess
 */

const mysql = require('mysql');

// Configura la conexión con la base de datos
const connection = mysql.createConnection({
  host: 'db', // El nombre del servicio de la base de datos en tu archivo docker-compose.yml
  user: 'root', // El usuario de la base de datos
  password: 'root', // La contraseña de la base de datos
  database: 'cropsense', // El nombre de tu base de datos
});

/**
 * Connects to the MySQL database.
 * @param {function} callback - The callback function to be executed after connecting to the database.
 * @throws {Error} If there is an error connecting to the database.
 */
connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL!');
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
 * Retrieves a user by email from the database.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 * @throws {Error} If there is an error retrieving the user.
 */
exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

/**
 * Creates a new user in the database.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to the created user object.
 * @throws {Error} If there is an error creating the user.
 */
exports.createUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO usuarios (nombre, correoElectronico, contraseña) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          reject(new Error('Email already exists'));
        } else {
          reject(err);
        }
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
 * @param {string} name - The name of the Arduino device.
 * @param {string} location - The location of the Arduino device.
 * @param {string} configState - The configuration state of the Arduino device.
 * @returns {Promise<Object>} A promise that resolves to the created Arduino device object.
 * @throws {Error} If there is an error creating the Arduino device.
 */
exports.createArduinoDevice = (name, location, configState) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO dispositivos_arduino (nombre, ubicacion, estadoConfiguracion) VALUES (?, ?, ?)', [name, location, configState], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};