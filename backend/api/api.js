const express = require('express');
const passport = require('passport');
const router = express.Router();


const userController = require('../controlador/userController');
const arduinoController = require('../controlador/arduinoController');



router.get('/', (req, res) => {
  res.send('Bienvenido a mi API!');
});


//Rutas de usuario
router.post('/users', async (req, res) => {
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'Email already exists') {
      res.status(409).json({ message: err.message });
    } else {
      // pendiente de más cosas
      res.status(500).json({ message: err.message });
    }
  }
});
// Rutas de inicio de sesión
// Estas rutas no deben requerir un token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userController.loginUser({ email, password });

  if (user === false) {
    res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
  } else {
    res.status(200).json(user);
  }
});

router.post('/arduino/register', async (req, res) => {
  try {
    const deviceData = req.body;
    const arduino = await arduinoController.registroArduino(deviceData);
    res.json(arduino);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.use(userController.verifyToken);
//GETS
router.get('/users/:email', async (req, res) => {
  try {
    const user = await userController.getUserByEmail(req.params.email);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users/:userId/arduinos', async (req, res) => {
  try {
    const arduinos = await arduinoController.getArduinosByUserId(req.params.userId);
    res.json(arduinos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/arduinos/:macAddress', async (req, res) => {
  try {
    const macAddress = decodeURIComponent(req.params.macAddress);
    const arduinos = await arduinoController.getArduinosByMac(macAddress);
    res.json(arduinos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//POSTS



//Rutas de dispositivos Arduino


//GETS
router.get('/arduino-devices/:id/sensors', async (req, res) => {
  try {
    const sensors = await arduinoController.getSensorsByArduinoId(req.params.id);
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/arduino-devices/:id', async (req, res) => {
  try {
    const arduino = await arduinoController.getArduinoById(req.params.id);
    res.json(arduino);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/arduino-devices', async (req, res) => {
  try {
    const devices = await arduinoController.getAllArduinoDevices();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



//POSTS
router.post('/arduino-devices', async (req, res) => {
  try {
    const device = await arduinoController.createArduinoDevice(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sensor/register', async (req, res) => {
  try {
    const sensorData = req.body;
    const sensor = await arduinoController.createSensor(sensorData);
    res.json(sensor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//DELETES
router.delete('/arduino-devices/:id', async (req, res) => {
  try {
    await arduinoController.deleteArduino(req.params.id);
    res.json({ message: 'Arduino deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/arduino-devices/:id', async (req, res) => { 
  try {
    const updatedDevice = await arduinoController.updateArduino(req.params.id, req.body);
    res.json(updatedDevice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sensor/readings', async (req, res) => {
  try {
    const readingsData = req.body.readingsData;
    const arduinoData = req.body.arduinoData;
    console.log('Received readings:', req.body);
    const readings = await arduinoController.receiveSensorReadings(readingsData, arduinoData);
    res.status(201).json({ message: 'Readings received and Arduino data updated.', readings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/sensor/readings', async (req, res) => {
  try {
    const readings = await arduinoController.getSensorReadings();
    res.status(200).json({ message: 'Lecturas obtenidas con exito.', readings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/sensor/readings/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const readings = await arduinoController.getSensorDetailsByDeviceId(id);
    if (readings.length > 0) {
      res.status(200).json({ message: 'Lecturas obtenidas con éxito.', readings });
    } else {
      res.status(404).json({ message: 'No se encontraron lecturas para el ID proporcionado.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/regado-manual/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extrae el id de los parámetros de la URL
    const { valor } = req.body; // Extrae el valor del cuerpo de la solicitud

    // Verifica que el valor no sea undefined
    if (valor === undefined) {
      return res.status(400).json({ message: 'La solicitud debe contener un valor.' });
    }

    // Llama a la función guardarValor
    const resultado = arduinoController.guardarValor(id, valor);

    if (resultado) {
      res.json({ message: `Valor ${valor} actualizado para el id ${id}.` });
    } else {
      // En este caso, siempre se devuelve true, pero puedes manejar errores si modificas la función
      res.status(500).json({ message: 'Ocurrió un error al intentar guardar el valor.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/cancelar-regado/:deviceId', async (req, res) => {
  try {
      const { deviceId } = req.params; // Obtiene el deviceId de los parámetros de la URL
      await arduinoController.cancelarRegadoManual(deviceId);
      res.json({ message: `Regado manual cancelado para el dispositivo con ID ${deviceId}` });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


router.get('/lecturas/:idDispositivo/:fechaInicio/:fechaFin', async (req, res) => {
  try {
    const { idDispositivo, fechaInicio, fechaFin } = req.params; // Obtiene el idDispositivo y las fechas de los parámetros de la URL
    const lecturas = await arduinoController.recuperarLecturasPorFechas(idDispositivo, fechaInicio, fechaFin);
    if (lecturas.length > 0) {
      res.json({ lecturas });
    } else {
      // En este caso, se devuelve un mensaje indicando que no se encontraron lecturas
      res.status(404).json({ message: 'No se encontraron lecturas para el dispositivo y rango de fechas proporcionado.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;