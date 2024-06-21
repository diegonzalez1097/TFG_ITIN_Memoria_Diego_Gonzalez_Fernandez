import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import React, { useEffect, useState } from 'react';


function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = fecha.getUTCDate().toString().padStart(2, '0');
  const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth() devuelve un índice basado en cero, por lo tanto, se suma 1.
  const año = fecha.getUTCFullYear();
  const horas = fecha.getUTCHours().toString().padStart(2, '0');
  const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
  const segundos = fecha.getUTCSeconds().toString().padStart(2, '0');
  return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
}

const Contacts = () => {
  const [arduinos, setArduinos] = useState([]); 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => { 
    const fetchArduinos = async () => {
      try {
        // Recuperar el token de autenticación del almacenamiento local
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/users/${userId}/arduinos`, {
          method: 'GET', // Método HTTP
          headers: {
            // Incluir el token en el encabezado de autorización
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArduinos(data); 
      } catch (error) {
        console.error("Error al cargar los datos de los arduinos:", error);
      }
    };
  
    fetchArduinos();
  }, []);
  const columns = [
    { field: "idDispositivo", headerName: "Id Dispositivo", flex: 0.5 },
    { field: "idUsuario", headerName: "Id Usuario" },
    {
      field: "nombre",
      headerName: "nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "ubicacion",
      headerName: "Ubicacion",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "ultimaIP",
      headerName: "Última IP",
      flex: 1,
      valueGetter: (params) => params.row.ultimaIP || "No disponible", // Añadir manejo para cuando ultimaIP es null
    },
    {
      field: "fechaUltimaComunicacion",
      headerName: "Fecha Ultima Comunicacion",
      flex: 1,
      renderCell: (params) => formatearFecha(params.value),
    },
    {
      field: 'coordenadasGPS',
      headerName: 'Coordenadas GPS',
      width: 200,
      valueGetter: (params) => 
        `${params.row.coordenadasGPS.x}, ${params.row.coordenadasGPS.y}`,
    },
    {
      field: "mac",
      headerName: "MAC",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={arduinos}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.idDispositivo} // Utiliza idDispositivo como id único para cada fila

        />
      </Box>
    </Box>
  );
};

export default Contacts;
