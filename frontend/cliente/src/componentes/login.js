import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });

      if (response.status === 200) {
        setLoginStatus('Inicio de sesión exitoso');
        localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento local
        localStorage.setItem('userId', response.data.idUsuario); // Guarda el ID del usuario en el almacenamiento local
        navigate('/index'); // Redirige al usuario a la nueva ruta
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginStatus('Correo electrónico o contraseña incorrectos.');
      } else {
        setLoginStatus('Ocurrió un error al iniciar sesión.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Correo electrónico:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Contraseña:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <button type="submit">Iniciar sesión</button>
      {loginStatus && <p>{loginStatus}</p>}
    </form>
  );
};

export default LoginComponent;