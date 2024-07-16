import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from "@mui/material";

const ControlRiegoManual = () => {
  const [error, setError] = useState('');
  const [estadoRiego, setEstadoRiego] = useState('');
  //const [ultimoBotonActivado, setUltimoBotonActivado] = useState(() => {
    //const valorGuardado = localStorage.getItem('ultimoBotonActivado');
    //return valorGuardado !== null ? JSON.parse(valorGuardado) : null;
  //});
  //const [riegoActivo, setRiegoActivo] = useState(false);
  const [estadoRiegoActivo, setEstadoRiegoActivo] = useState(null);

  const obtenerEstadoRiegoActivo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:3000/estado-regado-activo/9', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setEstadoRiegoActivo(response.data);
      setError('');
      //setRiegoActivo(response.data.estadoRiegoActivo.presente); // Asumiendo que 'presente' es un booleano que indica si el riego está activo
    } catch (error) {
      setError('Error al obtener el estado del riego');
      setEstadoRiegoActivo(null);
      //setRiegoActivo(false);
    }
  };

  useEffect(() => {
    obtenerEstadoRiegoActivo();
  }, []);

  const enviarEstadoRiego = async (valor) => {
    try {
      const token = localStorage.getItem('authToken');
      const idDispositivo = localStorage.getItem('idDispositivo');
      
      await axios.put(`http://localhost:3000/regado-manual/${idDispositivo}`, 
        { valor },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      setEstadoRiego(valor ? "Riego activado" : "Riego detenido");
      setError('');
      //setUltimoBotonActivado(valor);
      //setRiegoActivo(valor); // Actualiza el estado de riego activo
      obtenerEstadoRiegoActivo();
      window.location.reload();
      
    } catch (error) {
      setError('Error al actualizar el estado del riego');
      setEstadoRiego('');
      //setRiegoActivo(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {error && <Typography color="error">{error}</Typography>}
      {estadoRiego && <Typography>{estadoRiego}</Typography>}
      {estadoRiegoActivo && estadoRiegoActivo.estadoRiegoActivo.presente && (
        <Typography color="info">{estadoRiegoActivo.message}</Typography>
      )}
        <Button 
          variant="contained" 
          color="secondary" // Cambio aquí para "Activar Riego"
          onClick={() => enviarEstadoRiego(true)}
        >
          Activar Riego
        </Button>
        <Button 
          variant="contained" 
          color="primary" // Cambio aquí para "Parar Riego"
          onClick={() => enviarEstadoRiego(false)}
        >
          Parar Riego
        </Button>
    </Box>
  );
};

export default ControlRiegoManual;