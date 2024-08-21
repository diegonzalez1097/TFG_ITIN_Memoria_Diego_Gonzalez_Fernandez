import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axiosInstance from "../../axiosInstance";



function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = fecha.getUTCDate().toString().padStart(2, '0');
  const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0'); 
  const año = fecha.getUTCFullYear();
  const horas = fecha.getUTCHours().toString().padStart(2, '0');
  const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
  const segundos = fecha.getUTCSeconds().toString().padStart(2, '0');
  return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;

}

const localeText = {
  toolbarDensity: 'Densidad',
  toolbarDensityLabel: 'Densidad',
  toolbarDensityCompact: 'Compacto',
  toolbarDensityStandard: 'Estándar',
  toolbarDensityComfortable: 'Cómodo',
  toolbarColumns: 'Columnas',
  toolbarColumnsLabel: 'Seleccionar columnas',
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  filterPanelAddFilter: 'Añadir filtro',
  filterPanelDeleteIconLabel: 'Eliminar',
  filterPanelOperators: 'Operadores',
  filterPanelOperatorAnd: 'Y',
  filterPanelOperatorOr: 'O',
  filterPanelColumns: 'Columnas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Filtrar valor',
  filterOperatorContains: 'contiene',
  filterOperatorEquals: 'igual a',
  filterOperatorStartsWith: 'empieza con',
  filterOperatorEndsWith: 'termina con',
  filterOperatorIs: 'es',
  filterOperatorNot: 'no es',
  filterOperatorAfter: 'después de',
  filterOperatorOnOrAfter: 'en o después de',
  filterOperatorBefore: 'antes de',
  filterOperatorOnOrBefore: 'en o antes de',
  filterOperatorIsEmpty: 'está vacío',
  filterOperatorIsNotEmpty: 'no está vacío',
  filterOperatorIsAnyOf: 'es cualquiera de',
  // Añade más traducciones según sea necesario
};

const Devices = () => {
  const [arduinos, setArduinos] = useState([]); 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); 

  useEffect(() => { 
    const fetchArduinos = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axiosInstance.get(`users/${userId}/arduinos`);
        setArduinos(response.data); 
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
      headerName: "Nombre",
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
      valueGetter: (params) => params.row.ultimaIP || "No disponible", 
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
        title="Dispositivos"
        subtitle="Lista de dispositivos registrados por el usuario"
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
          getRowId={(row) => row.idDispositivo} 
          onRowClick={(params) => {
            localStorage.setItem('idDispositivo', params.row.idDispositivo);
            navigate('/dashboard');
          }}
          localeText={localeText}
        />
      </Box>
    </Box>
  );
};

export default Devices;
