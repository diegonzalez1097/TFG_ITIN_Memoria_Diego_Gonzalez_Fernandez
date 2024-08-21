import axiosInstance from '../../axiosInstance';
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const LecturasComponent = () => {
  const [lecturas, setLecturas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(new Date('1970-01-01'));
  const [fechaFin, setFechaFin] = useState(new Date());
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchLecturas = async () => {
      try {
        const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
        const fechaFinStr = fechaFin.toISOString().split('T')[0];
        const response = await axiosInstance.get(`/lecturas/9/${fechaInicioStr}/${fechaFinStr}`);
        setLecturas(response.data.lecturas);
      } catch (error) {
        console.error("Error al cargar las lecturas:", error);
      }
    };

    fetchLecturas();
  }, [fechaInicio, fechaFin]);

  const calcularFechas = (dias) => {
    const hoy = new Date();
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - dias);
    setFechaInicio(inicio);
    setFechaFin(hoy);
  };

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

  const columns = [
    { field: 'idLectura', headerName: 'ID Lectura', flex: 1 },
    { field: 'idSensor', headerName: 'ID Sensor', flex: 1 },
    { field: 'fechaHora', headerName: 'Fecha y Hora', flex: 2, valueGetter: (params) => formatearFecha(params.value) },
    { field: 'valor', headerName: 'Valor', type: 'number', flex: 1 },
    { field: 'tipoSensor', headerName: 'Tipo de Sensor', flex: 1.5 },
  ];

  return (
    <Box m="20px">
      <Header
        title="LECTURAS"
        subtitle="Listado de Lecturas"
      />
        <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" m="20px" className="miClaseBox">
          {/* Contenedor para los botones */}
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button variant="contained" color="secondary" onClick={() => calcularFechas(3)} className="miClaseBoton">Últimos 3 días</Button>
            <Button variant="contained" color="secondary" onClick={() => calcularFechas(5)} className="miClaseBoton">Últimos 5 días</Button>
            <Button variant="contained" color="secondary" onClick={() => calcularFechas(7)} className="miClaseBoton">Últimos 7 días</Button>
          </Box>
          {/* Contenedor para los inputs */}
          <Box display="flex" justifyContent="space-between" width="100%" marginTop="20px">
            <Typography variant="h6" color="textPrimary">Seleccione las fechas</Typography>
            
            <Box display="flex" justifyContent="flex-start" width="100%">
              <input
                type="date"
                value={fechaInicio.toISOString().split('T')[0]}
                onChange={(e) => setFechaInicio(new Date(e.target.value))}
                style={{ padding: '10px', margin: '5px' }} // Estilo inline como ejemplo
              />
              <input
                type="date"
                value={fechaFin.toISOString().split('T')[0]}
                onChange={(e) => setFechaFin(new Date(e.target.value))}
                style={{ padding: '10px', margin: '5px' }} // Estilo inline como ejemplo
              />
            </Box>
          </Box>
        </Box>
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
          rows={lecturas}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.idLectura}
          sortModel={[
            {
              field: 'fechaHora',
              sort: 'desc',
            },
          ]}
          localeText={localeText}
        />
      </Box>
    </Box>
  );
};

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

export default LecturasComponent;