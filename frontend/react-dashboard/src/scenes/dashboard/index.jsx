import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import LineChartSensor from "../../components/LineChartSensor";
import Chart from "../../components/chart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import SensorBox from "../../components/SensorBox";
import ProgressCircle from "../../components/ProgressCircle";
import React, { useState, useEffect } from 'react';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterIcon from '@mui/icons-material/Water';
import AirIcon from '@mui/icons-material/Air';


// Función para convertir camelCase a texto con espacios
function camelCaseToSpaces(text) {
  // Inserta un espacio antes de las mayúsculas y elimina el espacio inicial si existe
  const result = text.replace(/([A-Z])/g, " $1").trim();
  // Opcional: capitaliza la primera letra de cada palabra
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //const [error, setError] = useState('');
  const [sensores, setSensores] = useState([]);
  
  const idDispositivo = localStorage.getItem('idDispositivo');

  const sensorIcons = {
    Temperatura: <DeviceThermostatIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />,
    HumedadTierra: <WaterIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />,
    HumedadAire: <AirIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />,
    TemperaturaTierra: <ThermostatAutoIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />,
  };
  // Extiende el objeto de mapeo para las unidades
const sensorUnits = {
  HumedadAire: '%',
  HumedadTierra: '%',
  Temperatura: 'Cº',
  TemperaturaTierra: 'Cº',
  
};
  
  useEffect(() => { 
    const fetchSensorReadings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const idDispositivo = localStorage.getItem('idDispositivo');
        const response = await fetch(`http://localhost:3000/sensor/readings/${idDispositivo}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { readings } = await response.json(); // Extraer readings de la respuesta
        setSensores(readings); // Actualizar el estado con los readings
      } catch (error) {
        console.error("Error al cargar los datos de los arduinos:", error);
      }
    };
  
    fetchSensorReadings();
  }, [idDispositivo]);




  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Bienvenido a Cropsense" />


      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        {sensores.map((sensor, index) => (
          <Box
            key={index}
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <SensorBox
              title={camelCaseToSpaces(sensor.tipoSensor)} 
              subtitle={`${sensor.value} ${sensorUnits[sensor.tipoSensor] || ''}`} 
              icon={
                sensorIcons[sensor.tipoSensor]
              }
            />
          </Box>
        ))}


        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}

        >
          <Box
            mt="10px" // Margen superior ajustado
            mb="20px" // Añadiendo margen inferior
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
            <Typography
              variant="h5"
              fontWeight="600"
              color={colors.greenAccent[600]} // Establece el color del texto
              style={{ fontSize: "22px" }} // Establece el tamaño de la fuente
            >
              Gráfica de mediciones de temperatura de los ultimos 3 dias
            </Typography>

                

            </Box>

          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <Chart isDashboard={true}/>
          </Box>
        </Box>
        
        

        {/* ROW 3 */}
        {/*
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
        */}
      </Box>
    </Box>
  );
};

export default Dashboard;
