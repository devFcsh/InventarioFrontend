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
import { Link } from "react-router-dom";
import { useUser } from "@context/userContext";

export const NavBar: React.FC<NavBarProps> = ({ currentSection, setCurrentSection }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { user, rol, loading } = useUser();

  if(loading) return null;


  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem("rol");
        localStorage.clear();
        if (data.casLogoutUrl) {
          window.location.href = data.casLogoutUrl;
        } else {
          window.location.href = "/";
        }
      } else {
        console.error("❌ Error en logout:", data);
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("❌ Error durante logout:", error);
      localStorage.clear();
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <nav className="bg-yellow-500 w-full h-14 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <MenuIcon />
          </IconButton>
          <div className="w-60 h-auto overflow-hidden">
            <Link to={"/activos"}>
              <img className="w-full h-full object-cover" src={logoFCSH} alt="LogoFCSH" />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-black">
          <div className="flex items-center gap-1">
            <PersonIcon />
            <p>{user ? user.email : ""}</p>
          </div>
          <div 
            className={`flex items-center gap-1 cursor-pointer ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'}`}
            onClick={handleLogout}
          >
            <LogoutIcon />
            <p>{isLoggingOut ? "Cerrando..." : "Salir"}</p>
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
          rol={rol ?? ""} 
        />
      </MuiDrawer>
    </div>
  );
};
