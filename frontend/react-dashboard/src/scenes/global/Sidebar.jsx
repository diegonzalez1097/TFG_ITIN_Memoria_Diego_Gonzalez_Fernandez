import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LoginIcon from '@mui/icons-material/Login';
import DevicesIcon from '@mui/icons-material/Devices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import icon from './icon.png';

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        if (onClick) onClick();
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const location = useLocation();
  const navigate = useNavigate(); // Usar el hook useNavigate

  const logout = () => {
    // Eliminar el token de autenticación de localStorage
    localStorage.removeItem('authToken');

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login');
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Box display="flex" alignItems="center">
                <img src={icon} alt="icon" style={{ marginRight: "10px", width: "24px", height: "24px" }} /> {/* Añade tu imagen aquí */}
                <Typography variant="h3" color={colors.grey[100]}>
                    CROPSENSE
                  </Typography>
                </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              
            </Box>
          )}

          {/* Common Items */}
          {location.pathname !== '/login' && location.pathname !== '/signin' && (
            <>
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Dispositivos del usuario"
                to="/devices"
                icon={<DevicesIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Logout"
                to="#"
                icon={<ExitToAppIcon />}
                selected={selected}
                setSelected={setSelected}
                onClick={logout}
              />
            </>
          )}

          {/* Items for /login and /signin */}
          {(location.pathname === '/login' || location.pathname === '/signin') && (
            <>
              <Item
                title="Crear Usuario"
                to="/signin"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Login"
                to="/login"
                icon={<LoginIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;