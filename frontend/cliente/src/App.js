import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './componentes/login';
import Principal from './componentes/principal'; // Asegúrate de importar tu nuevo componente
//import NuevoComponente from './NuevoComponente'; // Asegúrate de importar tu nuevo componente

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/index" element={<Principal />} /> {/* Aquí está tu nueva ruta */}
        <Route path="/" element={<div>Bienvenido a la página principal</div>} /> {/* Aquí está tu nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;