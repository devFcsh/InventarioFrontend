import "./NavBar.css";
import logoFCSH from "../../assets/logoFCSH.png";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from "react";
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavBarItems } from "./NavBarItems";
import { Drawer as MuiDrawer } from '@mui/material';
import { NavBarProps } from "../PropsInterface";

export const NavBar: React.FC<NavBarProps> = ({ currentSection, setCurrentSection }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        <NavBarItems 
          currentSection={currentSection} 
          setCurrentSection={setCurrentSection} 
          setIsDrawerOpen={setIsDrawerOpen} 
        />
      </MuiDrawer>
    </div>
  );
};
