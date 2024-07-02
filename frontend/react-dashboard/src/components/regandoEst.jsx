import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';



import { tokens } from "../theme";
import { Box, Chip, Button, IconButton, Typography, useTheme } from "@mui/material";



const EstadoRiego = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const [resultadoRiego, setResultadoRiego] = useState(null);
    const [error, setError] = useState('');

  useEffect(() => {
    const fetchEstadoRiego = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const idDispositivo = localStorage.getItem('idDispositivo');
        const response = await fetch(`http://localhost:3000/resultado-riego/${idDispositivo}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
        if (!response.ok) {
          throw new Error('Error al obtener el estado del riego');
        }
        const data = await response.json();
        setResultadoRiego(data.resultadoRiego);
      } catch (error) {
        setError('Error al obtener el estado del riego');
      }
    };
  
    fetchEstadoRiego();
  }, []);

  return (
    <Box sx={{ padding: theme.spacing(2) }}>
      {error && (
        <Typography
        variant="h5"
        color={colors.redAccent[500]}
        sx={{ mt: "15px" }}
        >
          {error}
        </Typography>
      )}
      {resultadoRiego !== null && (
        <Chip
        label={resultadoRiego ? 'Activo' : 'Inactivo'}
        color={resultadoRiego ? 'success' : 'default'}
        variant="outlined"
        sx={{
          fontSize: '1.8rem', // Aumenta el tamaño de la fuente
          height: '90px', // Aumenta la altura del Chip
          borderRadius: '45px', // Ajusta el radio del borde para mantener la proporción
          padding: '0 100px', // Aumenta el padding horizontal para más espacio interno
          mt: '15px', // Margen superior
        }}
      />
      )}
    </Box>
  );
};

export default EstadoRiego;