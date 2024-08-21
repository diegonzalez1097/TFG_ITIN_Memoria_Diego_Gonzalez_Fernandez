import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

import { useNavigate } from "react-router-dom"; 



const Login = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate(); // Use useNavigate hook


  const handleFormSubmit = async (values) => {

    try {
      const response = await fetch('http://localhost:3000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos');
      }
  
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.idUsuario); // Guardar el ID del usuario

      // Paso 3: Redireccionar después del éxito
      navigate('/devices'); // Use navigate to redirect to the contacts page
      //alert('Login exitoso. Token: ' + localStorage.getItem('authToken') + ', ID del Usuario: ' + localStorage.getItem('userId'));
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error en el login: ' + error.message);

    }
  };


  return (
    <Box m="20px">
      <Header title="LOGIN" subtitle="Inicia sesion" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Login
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};


const checkoutSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("Requerido"),
  password: yup.string().required("Requerido"),
});
const initialValues = {
  email: "",
  password: "",
};

export default Login;
