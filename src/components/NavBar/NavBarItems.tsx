import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { NavBarItemsProps } from "../PropsInterface";

const sections = [
    { name: 'Equipos', icon: <ComputerIcon />, subtypes: [
      { name: 'Activos', route: 'activos' },
      { name: 'Bodega', route: 'bodega' },
      { name: 'Bajas', route: 'bajas' },
    ]},
    { name: 'Usuarios', icon: <PersonIcon />, route: 'usuarios' },
    { name: 'Admin', icon: <AdminPanelSettingsIcon />, route: 'admin' },
];


export const NavBarItems: React.FC<NavBarItemsProps> = ({ currentSection, setCurrentSection, setIsDrawerOpen }) => {
    const [openEquipos, setOpenEquipos] = useState(false);
    const navigate = useNavigate();
    const handleNavClick = (section: string) => {
        setCurrentSection(section);
        navigate(`/${section.toLowerCase()}`);
        setIsDrawerOpen(false);
    };

    const toggleEquipos = () => setOpenEquipos(!openEquipos);
  return (
    <>
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

    </>
  )
}
