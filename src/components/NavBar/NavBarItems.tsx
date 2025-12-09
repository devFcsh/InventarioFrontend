import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ComputerIcon from '@mui/icons-material/Computer';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NavBarItemsProps } from "../PropsInterface";

const AdminSections = [
  { name: 'Equipos', icon: <ComputerIcon />, subtypes: [
    { name: 'Activos', route: 'activos' },
    { name: 'Bodega', route: 'bodega' },
    { name: 'Bajas', route: 'bajas' },
  ]},
  { name: 'Mantenimientos', icon: <ConstructionIcon />, subtypes: [
    { name: 'Mantenimientos', route: 'mantenimientos' },
  ]},
  { name: 'Admin', icon: <AdminPanelSettingsIcon />, subtypes: [
    { name: 'Usuarios Responsables', route: 'usuarios' },
    { name: 'Categorías', route: 'categorias' },
    { name: 'Usuarios Sistema', route: 'usuariosSistema' },
  ]},
];

const EditorSections = [
  { name: 'Equipos', icon: <ComputerIcon />, subtypes: [
    { name: 'Activos', route: 'activos' },
    { name: 'Bodega', route: 'bodega' },
    { name: 'Bajas', route: 'bajas' },
  ]},
  { name: 'Mantenimientos', icon: <ConstructionIcon />, subtypes: [
    { name: 'Mantenimientos', route: 'mantenimientos' },
  ]},
  { name: 'Editor', icon: <AdminPanelSettingsIcon />, subtypes: [
    { name: 'Usuarios Responsables', route: 'usuarios' },
    { name: 'Categorías', route: 'categorias' },   
  ]},
];

const ConsultantSections = [
  { name: 'Equipos', icon: <ComputerIcon />, subtypes: [
    { name: 'Activos', route: 'activos' },
    { name: 'Bodega', route: 'bodega' },
  ]},
];

export const NavBarItems: React.FC<NavBarItemsProps> = ({ currentSection, setCurrentSection, setIsDrawerOpen, rol }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    Equipos: false,
    Admin: false,
    Editor: false,
  });

  const navigate = useNavigate();

  const handleNavClick = (section: string) => {
    setCurrentSection(section);
    navigate(`/${section.toLowerCase()}`);
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (currentSection) {
      localStorage.setItem('currentSection', currentSection);
    }
  }, [currentSection]);

  useEffect(() => {
    const savedSection = localStorage.getItem('currentSection');
    if (savedSection) {
      setCurrentSection(savedSection);
    }
  }, [setCurrentSection]);

  const toggleSection = (section: string) => {
    setOpenSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  let sections;
  if (rol === "administrador") {
    sections = AdminSections;
  } else if (rol === "editor") {
    sections = EditorSections;
  } else {
    sections = ConsultantSections;
  }

  return (
    <>
      <List>
        {sections.map((section) => (
          section.subtypes ? (
            <div key={section.name}>
              <ListItem
                onClick={() => toggleSection(section.name)} 
                className={`cursor-pointer px-4 py-2 ${
                  currentSection === section.name ? 'bg-gray-200 font-bold text-black' : 'text-gray-600'
                }`}
                component="div"
              >
                <ListItemIcon className="text-gray-600">{section.icon}</ListItemIcon>
                <ListItemText primary={section.name} />
                {openSections[section.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={openSections[section.name]} timeout="auto" unmountOnExit>
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
              onClick={() => handleNavClick(section.name)}
              className={`cursor-pointer px-4 py-2 ${
                currentSection === section.name ? 'bg-gray-200 font-bold text-black' : 'text-gray-600'
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
  );
};
