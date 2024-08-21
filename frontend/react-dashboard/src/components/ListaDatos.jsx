import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { tokens } from "../theme";

const ListaDatos = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate(); 

    const redirectToView = () => {
        navigate('../Registro'); 
    };

    return (
        <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
        >


      <Button
        variant="contained"
        color="secondary"
        onClick={redirectToView}
        sx={{ margin: "20px" }} // Ajusta el margen según necesites
      >
        Historial
      </Button>
    </Box>
  );
};

export default ListaDatos;