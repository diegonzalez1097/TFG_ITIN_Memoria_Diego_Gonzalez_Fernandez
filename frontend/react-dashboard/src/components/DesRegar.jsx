import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from "@mui/material";

const ControlRiegoDesactivar = () => {
  const [error, setError] = useState('');
  const [estadoRiegoActivo, setEstadoRiegoActivo] = useState(null);

  useEffect(() => {
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
      } catch (error) {
        setError('Error al obtener el estado del riego');
        setEstadoRiegoActivo(null);
      }
    };
  
    obtenerEstadoRiegoActivo();
  }, []);

  const cancelarRiego = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const idDispositivo = localStorage.getItem('idDispositivo');
      await axios.post(`http://localhost:3000/cancelar-regado/${idDispositivo}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setError('');
      // Actualizar el estado para reflejar que el riego ha sido cancelado
      setEstadoRiegoActivo(prevState => ({
        ...prevState,
        estadoRiegoActivo: {
          ...prevState.estadoRiegoActivo,
          presente: false,
        }
      }));
      window.location.reload();
    } catch (error) {
      setError('Error al cancelar el riego');
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {error && <Typography color="error">{error}</Typography>}
      {estadoRiegoActivo && estadoRiegoActivo.estadoRiegoActivo.presente && (
        <Button 
          variant="contained" 
          color="secondary"
          onClick={cancelarRiego}
        >
          Desactivar Riego Manual
        </Button>
      )}
    </Box>
  );
};

export default ControlRiegoDesactivar;