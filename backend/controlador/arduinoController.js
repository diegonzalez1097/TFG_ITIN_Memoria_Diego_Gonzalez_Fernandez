const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;


const arduinoAccess = require('../data/arduinoData');

const cron = require('node-cron');

let inMemoryReadings = [];

// Inicializar el Map globalmente
let necesitaRegarMap = new Map();

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


exports.guardarValor = (id, valor) => {
    necesitaRegarMap.set(id, valor);
    console.log(`Valor ${valor} actualizado para el id ${id}.`);
    return true; // Indica éxito en la actualización o inserción
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

    if (arduino && arduino.length > 0) {
        // El Arduino ya existe, actualiza la última IP y fecha de última comunicación utilizando la función actualizada
        await arduinoAccess.updateArduinoByMac(mac, { ultimaIP, fechaUltimaComunicacion });
        // Recargar el Arduino actualizado
        arduino = await arduinoAccess.getArduinosByMac(mac);
    } else {
        // El Arduino no existe, crea uno nuevo
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
 * Controlador para actualizar la última IP y fecha de última comunicación de un dispositivo Arduino.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
exports.actualizarDatosArduino = async (idDispositivo, ultimaIP, fechaUltimaComunicacion) => {
    try {
        // Asegúrate de validar los datos aquí (por ejemplo, verificar que idDispositivo no sea nulo, etc.)

        await arduinoData.actualizarUltimaComunicacion(idDispositivo, ultimaIP, fechaUltimaComunicacion);

        // Retorna un mensaje de éxito o simplemente true para indicar que la operación fue exitosa.
        return 'Datos del dispositivo actualizados correctamente.';
    } catch (error) {
        console.error('Error al actualizar datos del dispositivo:', error);
        // Lanza una excepción o retorna false para indicar que la operación falló.
        throw new Error('Error al actualizar los datos del dispositivo.');
    }
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

function necesitaRegar(deviceId) {
    console.log('Llamando a necesitaRegar con deviceId:', deviceId);
    necesitaRegarMap.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${value}`);
    });

    console.log(`Verificando deviceId: '${deviceId}'`); // Asegúrate de que deviceId tiene el valor esperado
    console.log(`Contenido de necesitaRegarMap:`, necesitaRegarMap); // Verifica el contenido de necesitaRegarMap
    
    riegaIdArd = deviceId.toString();

    if (necesitaRegarMap.has(riegaIdArd)) {
        console.log(`El deviceId ${riegaIdArd} está presente en necesitaRegarMap.`);
        return necesitaRegarMap.get(riegaIdArd);
    } else {
        console.log(`El deviceId ${riegaIdArd} NO está presente en necesitaRegarMap.`);
    }

    // Definir umbrales
    const umbralHumedadTierra = 20;
    const umbralHumedadAire = 40;
    const umbralTemperatura = 18;

    // Filtrar primero por deviceId
    const lecturasDelDispositivo = inMemoryReadings.filter(lectura => lectura.deviceId === deviceId);
    //console.log('Lecturas encontradas para el dispositivo:', lecturasDelDispositivo.length);

    // Filtrar para obtener la última lectura de cada tipo de sensor relevante
    const ultimaTemperatura = lecturasDelDispositivo.filter(lectura => lectura.tipoSensor === 'Temperatura').pop()?.value;
    const ultimaHumedadAire = lecturasDelDispositivo.filter(lectura => lectura.tipoSensor === 'HumedadAire').pop()?.value;
    const ultimaHumedadTierra = lecturasDelDispositivo.filter(lectura => lectura.tipoSensor === 'HumedadTierra').pop()?.value;
    const ultimaTemperaturaTierra = lecturasDelDispositivo.filter(lectura => lectura.tipoSensor === 'TemperaturaTierra').pop()?.value;

    console.log('Lecturas del dispositivo ' + deviceId + ':', ultimaTemperatura, ultimaHumedadAire, ultimaHumedadTierra, ultimaTemperaturaTierra);

    // Verificar si alguna de las lecturas no está disponible
    if (!ultimaTemperatura || !ultimaHumedadAire || !ultimaHumedadTierra || !ultimaTemperaturaTierra) {
        console.log("No hay suficientes lecturas disponibles para el dispositivo " + deviceId);
        return false;
    }

    // Verificar condiciones para el riego
    if (ultimaHumedadTierra < umbralHumedadTierra || 
        ultimaHumedadAire < umbralHumedadAire || 
        ultimaTemperaturaTierra < umbralTemperatura) {
        return true; // Necesita riego
    }

    return false; // No necesita riego
}


/**
 * Inserta nuevas lecturas de sensor en el array en memoria.
 * @param {Array} readingsData - Un array de objetos de datos de lectura del sensor.
 */
exports.receiveSensorReadings = (readingsData, arduinoData) => {
    // Extrae el idDispositivo y fechaUltimaComunicacion de arduinoData
    const { idDispositivo, fechaUltimaComunicacion, ...updateData } = arduinoData;
    //console.log('Adding data to inMemoryReadings:', readingsData);
    for (let readingData of readingsData) {
        // Agrega el idDispositivo y fechaUltimaComunicacion (como dateTime) a readingData
        readingData.deviceId = idDispositivo;
        readingData.dateTime = fechaUltimaComunicacion;
    
        // Verifica si la lectura ya existe en inMemoryReadings
        const existingReadingIndex = inMemoryReadings.findIndex(reading => 
            reading.sensorId === readingData.sensorId && 
            reading.deviceId === readingData.deviceId
        );
    
        // Si la lectura no existe en inMemoryReadings, la agrega
        if (existingReadingIndex === -1) {
            inMemoryReadings.push(readingData);
        } else {
            // Si la lectura ya existe, la actualiza
            inMemoryReadings[existingReadingIndex] = readingData;
        }
    }
    // Llama a la función updateArduino con el idDispositivo y los datos de actualización
    exports.updateArduino(idDispositivo, updateData);
    console.log('Adding data to inMemoryReadings:', arduinoData);
    console.log(inMemoryReadings);
    // Al final de la función receiveSensorReadings, captura el resultado de necesitaRegar()
    const resultadoRiego = necesitaRegar(idDispositivo);
    console.log('¿Necesita regar?:', resultadoRiego);
    return { inMemoryReadings, resultadoRiego };
};

/**
 * Esta función se ejecuta x
 * Recorre el array `inMemoryReadings` y guarda cada lectura en la base de datos.
 * Después de guardar todas las lecturas, vacía el array `inMemoryReadings`.
 */
cron.schedule('0 * * * *', async () => {
    console.log('Running cron job. Current inMemoryReadings:', inMemoryReadings);
    for (let reading of inMemoryReadings) {
        await exports.insertSensorReadings([reading]);
    }
    inMemoryReadings = [];
    console.log('Cron job finished. inMemoryReadings should be empty:', inMemoryReadings);
});


exports.cancelarRegadoManual = function(deviceId) {
    deviceId = deviceId.toString(); // Asegurar que el deviceId sea una cadena
    if (necesitaRegarMap.delete(deviceId)) {
        console.log(`El dispositivo con ID ${deviceId} ha sido eliminado de necesitaRegarMap.`);
    } else {
        console.log(`No se encontró el dispositivo con ID ${deviceId} en necesitaRegarMap.`);
    }
};

/**
 * Devuelve el array en memoria de lecturas del sensor.
 * @returns {Array} El array en memoria de lecturas del sensor.
 */
exports.getSensorReadings = () => {
    return inMemoryReadings;
};

/**
 * Devuelve el tipoSensor y value de las lecturas asociadas a un deviceId específico.
 * @param {number} deviceId - El ID del dispositivo del cual obtener las lecturas.
 * @returns {Array} Un array de objetos con el tipoSensor y value de cada lectura asociada al deviceId.
 */
exports.getSensorDetailsByDeviceId = (deviceId) => {
    return inMemoryReadings
        .filter(reading => reading.deviceId === deviceId)
        .map(reading => ({
            tipoSensor: reading.tipoSensor,
            value: reading.value
        }));
};
/**
 * Recupera lecturas de sensor entre dos fechas desde la capa de datos.
 * @param {string} fechaInicio - La fecha de inicio en formato 'YYYY-MM-DD'.
 * @param {string} fechaFin - La fecha de fin en formato 'YYYY-MM-DD'.
 * @returns {Promise} Una promesa que se resuelve con las lecturas recuperadas o un error.
 */
exports.recuperarLecturasPorFechas = async (idDispositivo, fechaInicio, fechaFin) => {
    const lecturas = await arduinoAccess.getSensorReadingsBetweenDates(idDispositivo, fechaInicio, fechaFin).catch(error => {
        console.error('Error al recuperar lecturas:', error);
        return []; // Retorna un array vacío o cualquier otro valor que indique un error de manera segura.
    });
    console.log('Lecturas recuperadas:', lecturas);
    return lecturas;
};