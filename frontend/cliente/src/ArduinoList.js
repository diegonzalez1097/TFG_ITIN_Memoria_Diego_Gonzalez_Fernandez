import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ArduinoList() {
  const [arduinos, setArduinos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/arduino-devices')
      .then(response => {
        setArduinos(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>Arduinos</h1>
      <ul>
        {arduinos.map((arduino, index) => (
          <li key={index}>
            id: {arduino.idDispositivo} nombre {arduino.nombre} ubicacion: {arduino.ubicacion}  
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArduinoList;