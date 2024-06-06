import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './principal.css';

function Principal() {
  const [arduinos, setArduinos] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sensorReadings, setSensorReadings] = useState([]); 



  useEffect(() => {
    const fetchArduinos = async () => {
      const userId = localStorage.getItem('userId'); // Recupera el ID del usuario del almacenamiento local
      const token = localStorage.getItem('token'); // Recupera el token del almacenamiento local
      try {
        const response = await axios.get(`http://localhost:3000/users/${userId}/arduinos`, {
          headers: {
            'Authorization': `Bearer ${token}` // Incluye el token en la cabecera de la solicitud
          }
        });
        setArduinos(response.data);
      } catch (error) {
        console.error('Ocurrió un error al obtener los arduinos:', error);
      }
    };
    const fetchWeather = async () => {
        try {
          const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=43.550299&longitude=-5.922112&hourly=temperature_2m`);
          console.log(response.data);
          setWeather(response.data);
          setLoading(false); // Agrega esta línea
        } catch (error) {
          console.error('Ocurrió un error al obtener el tiempo:', error);
          setLoading(false); // Agrega esta línea
        }
      };

      const fetchSensorReadings = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get('http://localhost:3000/sensor/readings', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setSensorReadings(response.data.readings);
          //console.log(sensorReadings)
        } catch (error) {
          console.error('Error fetching sensor readings:', error);
        }
      };

      fetchArduinos();
      fetchWeather();
      fetchSensorReadings();
  }, []);

  return (
    <div>
      <h1>Arduinos del usuario:</h1>
      {arduinos.map((arduino, index) => (
        <div key={index}>
          <h2>{arduino.nombre}</h2>
          <p>Ubicación: {arduino.ubicacion}</p>
          <p>Última IP: {arduino.ultimaIP}</p>
          <p>Fecha Última Comunicación: {new Date(arduino.fechaUltimaComunicacion).toLocaleString()}</p>
          <p>Coordenadas GPS: {arduino.coordenadasGPS.x}, {arduino.coordenadasGPS.y}</p>
          <p>MAC: {arduino.mac}</p>
          <table className="sensor-table">
            <thead>
              <tr>
                <th>Sensor ID</th>
                <th>Fecha y hora</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {sensorReadings.filter(reading => reading.deviceId === arduino.idDispositivo).map((reading, index) => (
                <tr key={index}>
                  <td>{reading.sensorId}</td>
                  <td>{reading.dateTime}</td>
                  <td>{reading.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {loading ? (
        <p>Cargando datos del clima...</p>
      ) : (
        weather && weather.hourly && weather.hourly.temperature_2m && (
          <div className="weather-container"> {/* Agrega esta línea */}
            <h1>Tiempo en Aviles:</h1>
            <p>Temperatura: {weather.hourly.temperature_2m[0]} °C</p>
          </div>
        )
      )}
    </div>
  );
}

export default Principal;