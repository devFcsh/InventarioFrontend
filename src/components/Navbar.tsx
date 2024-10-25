import "./Navbar.css";
import logoFCSH from "../assets/logoFCSH.png";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ComputerIcon from '@mui/icons-material/Computer';
import { useState } from "react";
import { Drawer as MuiDrawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const sections = [
  { name: 'Equipos', icon: <ComputerIcon />, subtypes: [
    { name: 'Activos', route: 'activos' },
    { name: 'Bodega', route: 'bodega' },
    { name: 'Bajas', route: 'bajas' },
  ]},
  { name: 'Usuarios', icon: <PersonIcon />, route: 'usuarios' },
  { name: 'Admin', icon: <AdminPanelSettingsIcon />, route: 'admin' },
];

export const Navbar = ({ currentSection, setCurrentSection }: NavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openEquipos, setOpenEquipos] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (section: string) => {
    setCurrentSection(section);
    navigate(`/${section.toLowerCase()}`);
    setIsDrawerOpen(false);
  };

  const toggleEquipos = () => setOpenEquipos(!openEquipos);

  return (
    <div>
      <nav className="bg-yellow-500 w-full h-14 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <MenuIcon />
          </IconButton>
          <div className="w-40 h-auto overflow-hidden">
            <img className="w-full h-full object-cover" src={logoFCSH} alt="LogoFCSH" />
          </div>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-black">
          <div className="flex items-center gap-1">
            <PersonIcon />
            <p>Jorge Navarrete</p>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <LogoutIcon />
            <p>Salir</p>
          </div>
        </div>
      </nav>
      
      <MuiDrawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          style: {
            width: '240px',
            padding: '10px 0',
            backgroundColor: '#f0f0f5',
          }
        }}
      >
        <List>
          {sections.map((section) => (
            section.subtypes ? (
              <div key={section.name}>
                <ListItem 
                  onClick={toggleEquipos} 
                  className={`cursor-pointer px-4 py-2 ${
                    currentSection === 'Equipos' ? 'bg-gray-200 font-bold text-black' : 'text-gray-600'
                  }`}
                  component="div"
                >
                  <ListItemIcon className="text-gray-600">{section.icon}</ListItemIcon>
                  <ListItemText primary={section.name} />
                  {openEquipos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse in={openEquipos} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {section.subtypes.map((subtype) => (
                      <ListItem 
                        key={subtype.name} 
                        onClick={() => handleNavClick(subtype.route)}
                        className={`cursor-pointer pl-10 pr-4 py-2 text-gray-600 ${
                          currentSection === subtype.route ? 'bg-gray-200 font-bold' : ''
                        }`}
                        component="button"
                      >
                        <ListItemText primary={subtype.name} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </div>
            ) : (
              <ListItem 
                key={section.name} 
                onClick={() => handleNavClick(section.route || section.name)}
                className={`cursor-pointer px-4 py-2 ${
                  currentSection === section.route ? 'bg-gray-200 font-bold text-black' : 'text-gray-600'
                }`}
                component="button"
              >
                <ListItemIcon className="text-gray-600">{section.icon}</ListItemIcon>
                <ListItemText primary={section.name} />
              </ListItem>
            )
          ))}
        </List>
      </MuiDrawer>
    </div>
  );
};
