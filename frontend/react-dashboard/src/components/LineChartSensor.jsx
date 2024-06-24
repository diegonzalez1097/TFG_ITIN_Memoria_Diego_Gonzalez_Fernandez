import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockLineData as data } from "../data/mockData";
import React, { useState, useEffect } from 'react'; // Importar useState y useEffect
import { format } from 'date-fns';

const formatDate = (value) => format(new Date(value), 'dd/MM/yyyy HH:mm');
const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);
  

  const idDispositivo = localStorage.getItem('idDispositivo');
  const token = localStorage.getItem('authToken');


  useEffect(() => {
    const fetchSensorReadings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const idDispositivo = localStorage.getItem('idDispositivo');
        const response = await fetch(`http://localhost:3000/lecturas/${idDispositivo}/2024-06-22/2024-06-24`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { lecturas } = await response.json();
  
        // Agrupar lecturas por idSensor
        const lecturasPorSensor = lecturas.reduce((acc, { idSensor, fechaHora, valor }) => {
          if (!acc[idSensor]) {
            acc[idSensor] = [];
          }
          
          acc[idSensor].push({ x: new Date(fechaHora), y: valor });
          return acc;
        }, {});
  
        // Transformar los datos agrupados en la estructura deseada
        const dataTransformada = Object.keys(lecturasPorSensor).map(idSensor => ({
          id: idSensor,
          color: tokens("dark").greenAccent[500], // Asumiendo que cada idSensor puede tener el mismo color, ajusta según sea necesario
          data: lecturasPorSensor[idSensor],
        }));
  
        setChartData(dataTransformada);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
  
    fetchSensorReadings();
  }, []);
  
  return (
    <ResponsiveLine
      data={chartData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              //fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "time" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: -20,
        
        format: formatDate, // Aplica la función de formato aquí
        legend: isDashboard ? undefined : "Fecha", // Asegúrate de que la leyenda sea adecuada
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 3, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
