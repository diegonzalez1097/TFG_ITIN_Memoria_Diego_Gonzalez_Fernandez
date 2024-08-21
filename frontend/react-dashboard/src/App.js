import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Devices from "./scenes/devices";
import Signin from "./scenes/signin";
import Login from "./scenes/login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Registro from "./scenes/Registro/registro";
import ProtectedRoute from './protectedRoute';


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
              <Route path="/team" element={<ProtectedRoute element={Team} />} />
              <Route path="/devices" element={<ProtectedRoute element={Devices} />} />
              <Route path="/registro" element={<ProtectedRoute element={Registro} />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} /> {/* Redirigir a login por defecto */}

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
