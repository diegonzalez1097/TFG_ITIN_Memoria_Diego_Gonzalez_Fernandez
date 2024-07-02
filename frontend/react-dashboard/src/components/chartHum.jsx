import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseISO, format, subHours } from 'date-fns';
import { useTheme } from "@mui/material";

const CustomTooltip = ({ active, payload }) => {
    const theme = useTheme(); // Accede al tema actual

    // Estilos personalizados que utilizan el tema y tokens
    const tooltipStyles = {
      backgroundColor: theme.palette.background.paper + 'DD', 
      color: theme.palette.text.primary, 
      padding: '10px',
      border: `1px solid ${theme.palette.divider}`, 
      borderRadius: '5px',
      boxShadow: `0px 0px 15px ${theme.palette.divider}` 
    };

    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={tooltipStyles}>
          <p className="label">{`Fecha: ${payload[0].payload.name}`}</p>
          <p className="intro">{`Valor: ${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
};

const CustomLineChart = () => {
  const [data, setData] = useState([]);
  const [yAxisDomain, setYAxisDomain] = useState([0, 'auto']); // Estado para el dominio del eje Y
    const formatDate = (value) => {
    // Suponiendo que value es una fecha en formato 'YYYY-MM-DD'
    const date = new Date(value);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 10);

        
        const formatDate = (date) => date.toISOString().split('T')[0];
        const startDate = formatDate(threeDaysAgo);
        const endDate = formatDate(today);
        
        const token = localStorage.getItem('authToken');
        const idDispositivo = localStorage.getItem('idDispositivo');
        const response = await fetch(`http://localhost:3000/lecturas/humedadAire/${idDispositivo}/${startDate}/${endDate}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
  
        const dataArray = jsonData.lecturas;
  
        const transformedData = dataArray.map(lectura => ({
            name: format(subHours(parseISO(lectura.fechaHora), 2), 'dd/MM/yyyy HH:mm'),
            Valor: lectura.valor,
            tipoSensor: lectura.tipoSensor
          }));

        // Ajustar el dominio del eje Y basado en los valores calculados
        const minValue = Math.min(...transformedData.map(item => item.Valor));
        const maxValue = Math.max(...transformedData.map(item => item.Valor));

        // Ajustar el valor mínimo y máximo para incluir un margen
        const adjustedMinValue = minValue - (minValue * 0.02); // Margen inferior del 5%
        const adjustedMaxValue = maxValue + (maxValue * 0.02); // Margen superior del 5%

        setYAxisDomain([adjustedMinValue, adjustedMaxValue]);

        setData(transformedData);

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={265}>
      <LineChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={yAxisDomain} tickFormatter={(value) => Math.round(value)} />
        
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="Valor"  stroke="#8884d8" activeDot={{ r: 8 }} />
        
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;