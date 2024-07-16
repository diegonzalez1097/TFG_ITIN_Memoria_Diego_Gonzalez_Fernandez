import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Ensure this import is present

import { tokens } from "../theme";

const ListaDatos = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate(); // Use useNavigate here

    const redirectToView = () => {
        navigate('../calendar'); // Use navigate instead of history.push
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
        Ir a otra vista
      </Button>
    </Box>
  );
};

export default ListaDatos;