/**
 * Módulo para acceder a los datos de la base de datos.
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
 * Se conecta a la base de datos MySQL.
 * @param {function} callback - La función de callback que se ejecutará después de conectarse a la base de datos.
 * @throws {Error} Si hay un error al conectarse a la base de datos.
 */
connection.connect((err) => {
  if (err){
    console.error('Error al conectar a la base de datos MySQL: ' + err.stack);
    return;
  }
  //console.log('Conectado a la base de datos MySQL!');
});

/**
 * Recupera todos los dispositivos Arduino de la base de datos.
 * @returns {Promise<Array<Object>>} Una promesa que se resuelve a un array de dispositivos Arduino.
 * @throws {Error} Si hay un error al recuperar los dispositivos Arduino.
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
 * Recupera todos los sensores para un dispositivo Arduino dado de la base de datos.
 * @param {number} arduinoId - El ID del dispositivo Arduino.
 * @returns {Promise<Array<Object>>} Una promesa que se resuelve a un array de sensores.
 * @throws {Error} Si hay un error al recuperar los sensores.
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
 * Crea un nuevo dispositivo Arduino en la base de datos.
 * @param {number} userId - El id del usuario.
 * @param {string} name - El nombre del dispositivo Arduino.
 * @param {string} location - La ubicación del dispositivo Arduino.
 * @param {string} lastIP - La última IP del dispositivo Arduino.
 * @param {Date} lastCommunicationDate - La última fecha de comunicación del dispositivo Arduino.
 * @param {Object} gpsCoordinates - Las coordenadas GPS del dispositivo Arduino.
 * @returns {Promise<Object>} Una promesa que se resuelve al objeto del dispositivo Arduino creado.
 * @throws {Error} Si hay un error al crear el dispositivo Arduino.
 */
exports.createArduinoDevice = (userId, name, location, lastIP, lastCommunicationDate, gpsCoordinates, mac) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'INSERT INTO dispositivos_arduino (idUsuario, nombre, ubicacion, ultimaIP, fechaUltimaComunicacion, coordenadasGPS, mac) VALUES (?, ?, ?, ?, ?, ST_GeomFromText(?), ?)', 
      [userId, name, location, lastIP, lastCommunicationDate, 'POINT(' + gpsCoordinates.x + ' ' + gpsCoordinates.y + ')', mac], 
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};


/**
 * Elimina un dispositivo Arduino de la base de datos.
 * @param {number} arduinoId - El ID del dispositivo Arduino.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el dispositivo Arduino ha sido eliminado.
 * @throws {Error} Si hay un error al eliminar el dispositivo Arduino.
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
 * Recupera un dispositivo por id de la base de datos.
 * @param {number} id - El id del dispositivo.
 * @returns {Promise<Object>} Una promesa que se resuelve al objeto del dispositivo.
 * @throws {Error} Si hay un error al recuperar el dispositivo.
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
 * Recupera todos los dispositivos Arduino para un usuario específico de la base de datos.
 * @param {number} userId - El id del usuario.
 * @returns {Promise<Array>} Una promesa que se resuelve a un array de dispositivos Arduino.
 * @throws {Error} Si hay un error al recuperar los dispositivos Arduino.
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

/**
 * Obtiene dispositivos Arduino por dirección MAC.
 *
 * @param {string} mac La dirección MAC del dispositivo Arduino.
 * @returns {Promise} Una promesa que se resuelve a los dispositivos Arduino que coinciden con la dirección MAC.
 * @throws {Error} Si hay un error al recuperar los dispositivos Arduino.
 */
exports.getArduinosByMac = (mac) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM dispositivos_arduino WHERE mac = ?', [mac], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

/**
 * Crea un nuevo sensor en la base de datos.
 * @param {number} deviceId - El id del dispositivo Arduino.
 * @param {string} sensorType - El tipo del sensor.
 * @param {string} associatedPins - Los pines asociados del sensor.
 * @param {string} description - La descripción del sensor.
 * @returns {Promise} Una promesa que se resuelve cuando el sensor se crea con éxito.
 * @throws {Error} Si hay un error al crear el sensor.
 */
exports.createSensor = (deviceId, sensorType, associatedPins, description) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO dispositivos_sensores (idDispositivo, tipoSensor, pinesAsociados, descripcion) VALUES (?, ?, ?, ?)';
    connection.query(query, [deviceId, sensorType, associatedPins, description], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


/**
 * Actualiza un dispositivo Arduino en la base de datos.
 * @param {number} idDispositivo - El id del dispositivo Arduino.
 * @param {Object} updateData - Un objeto con los campos a actualizar.
 * @returns {Promise} Una promesa que se resuelve cuando el dispositivo Arduino se actualiza con éxito.
 * @throws {Error} Si hay un error al actualizar el dispositivo Arduino.
 */
exports.updateArduino = (idDispositivo, updateData) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);
  values.push(idDispositivo);

  const fieldUpdates = fields.map(field => `${field} = ?`).join(', ');

  const query = `UPDATE dispositivos_arduino SET ${fieldUpdates} WHERE idDispositivo = ?`;

  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

/**
 * Actualiza la última IP y fecha de última comunicación de un dispositivo Arduino en la base de datos basándose en su dirección MAC.
 * @param {string} macDispositivo - La dirección MAC del dispositivo Arduino.
 * @param {object} updateData - Un objeto con los datos a actualizar.
 * @returns {Promise} Una promesa que se resuelve cuando los datos se actualizan con éxito.
 * @throws {Error} Si hay un error al actualizar los datos.
 */
exports.updateArduinoByMac = async (macDispositivo, updateData) => {
  try {
    const result = await connection.query(
      `UPDATE dispositivos_arduino SET ultimaIP = ?, fechaUltimaComunicacion = ? WHERE mac = ?`,
      [updateData.ultimaIP, updateData.fechaUltimaComunicacion, macDispositivo]
    );
    // Ajusta esta línea según el formato real de la respuesta
    return result[0]; // Suponiendo que result[0] contiene el resultado esperado
  } catch (error) {
    throw new Error(`Error al actualizar el dispositivo Arduino: ${error.message}`);
  }
};

/**
 * Inserta lecturas de sensor en la base de datos.
 * @param {Array} readings - Un array de objetos de datos de lectura del sensor. Cada objeto debe tener propiedades: sensorId, dateTime, value.
 * @returns {Promise} Una promesa que se resuelve cuando todas las lecturas han sido insertadas.
 * @throws {Error} Si hay un error al insertar una lectura.
 */
//esta preparado para recibir arrays pero finalmente solo recibe un objeto
exports.insertSensorReadings = (readings) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO lecturas_sensores (idSensor, fechaHora, valor) VALUES ?';
    const values = readings.map(reading => [reading.sensorId, reading.dateTime, reading.value]);
    connection.query(query, [values], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};